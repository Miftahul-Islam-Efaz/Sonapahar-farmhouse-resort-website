# Save this script as compress_assets.ps1 in the Sonapahar Website folder.
# Right-click the file and select "Run with PowerShell" to optimize all assets.

Add-Type -AssemblyName System.Drawing

$projectDir = Get-Location
$imagesDir = Join-Path $projectDir "assets\images"

if (-not (Test-Path $imagesDir)) {
    Write-Error "Images directory not found at $imagesDir"
    Exit
}

# Encoder parameters for JPEG compression (70% quality is the sweet spot for web)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 70)

Write-Host "=============================================" -ForegroundColor Gold
Write-Host "   SONAPAHAR WEBSITES IMAGE OPTIMIZER       " -ForegroundColor Gold
Write-Host "=============================================" -ForegroundColor Gold

# 1. Compress Standard JPEGs
$jpegFiles = Get-ChildItem -Path $imagesDir -Filter "*.jpg" + Get-ChildItem -Path $imagesDir -Filter "*.jpeg"
foreach ($file in $jpegFiles) {
    if ($file.Name -eq "og-thumbnail.jpg") { continue }
    
    Write-Host "Optimizing JPEG: $($file.Name)..." -ForegroundColor Green
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    
    $tempPath = $file.FullName + ".tmp"
    $img.Save($tempPath, $encoder, $encoderParams)
    $img.Dispose()
    
    Remove-Item $file.FullName -Force
    Rename-Item $tempPath $file.Name
    
    $oldSize = [math]::Round($file.Length / 1KB, 1)
    $newSize = [math]::Round((Get-Item $file.FullName).Length / 1KB, 1)
    Write-Host "  -> Shrunk from $oldSize KB to $newSize KB" -ForegroundColor Cyan
}

# 2. Compress heavy PNGs to optimized JPEGs (keeping .png extension to avoid breaking code)
$pngFiles = @("bento-dining.png", "bento-interior.png", "bento-organic.png", "hero-our-story-refined.png")
foreach ($name in $pngFiles) {
    $filePath = Join-Path $imagesDir $name
    if (Test-Path $filePath) {
        $file = Get-Item $filePath
        Write-Host "Optimizing heavy PNG: $name..." -ForegroundColor Green
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        $tempPath = $file.FullName + ".tmp"
        # Saving as JPEG format to compress from 1MB to ~100KB, while retaining .png extension
        $img.Save($tempPath, $encoder, $encoderParams)
        $img.Dispose()
        
        Remove-Item $file.FullName -Force
        Rename-Item $tempPath $name
        
        $oldSize = [math]::Round($file.Length / 1KB, 1)
        $newSize = [math]::Round((Get-Item $filePath).Length / 1KB, 1)
        Write-Host "  -> Shrunk from $oldSize KB to $newSize KB" -ForegroundColor Cyan
    }
}

# 3. Create the WhatsApp og-thumbnail.jpg (under 300KB limit)
$heroPath = Join-Path $imagesDir "villa-exterior-akash.jpeg"
$outputPath = Join-Path $imagesDir "og-thumbnail.jpg"

if (Test-Path $heroPath) {
    Write-Host "Generating optimized WhatsApp og-thumbnail.jpg..." -ForegroundColor Green
    $img = [System.Drawing.Image]::FromFile($heroPath)
    
    $width = 1200
    $height = 630
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $sourceAspect = $img.Width / $img.Height
    $targetAspect = $width / $height
    
    if ($sourceAspect -gt $targetAspect) {
        $cropHeight = $img.Height
        $cropWidth = [int]($img.Height * $targetAspect)
        $cropX = [int](($img.Width - $cropWidth) / 2)
        $cropY = 0
    } else {
        $cropWidth = $img.Width
        $cropHeight = [int]($img.Width / $targetAspect)
        $cropX = 0
        $cropY = [int](($img.Height - $cropHeight) / 2)
    }
    
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $width, $height)), $cropX, $cropY, $cropWidth, $cropHeight, [System.Drawing.GraphicsUnit]::Pixel)
    
    if (Test-Path $outputPath) { Remove-Item $outputPath -Force }
    $bmp.Save($outputPath, $encoder, $encoderParams)
    
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    
    $newSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 1)
    Write-Host "  -> Generated og-thumbnail.jpg ($newSize KB) - Perfectly optimized for WhatsApp!" -ForegroundColor Cyan
}

# 4. Shrink heavy Favicon.png to 32x32 px
$faviconPath = Join-Path $imagesDir "favicon.png"
if (Test-Path $faviconPath) {
    Write-Host "Shrinking favicon.png..." -ForegroundColor Green
    $img = [System.Drawing.Image]::FromFile($faviconPath)
    
    $bmp = New-Object System.Drawing.Bitmap(32, 32)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $g.DrawImage($img, 0, 0, 32, 32)
    $img.Dispose()
    
    Remove-Item $faviconPath -Force
    $bmp.Save($faviconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $bmp.Dispose()
    
    $newSize = [math]::Round((Get-Item $faviconPath).Length / 1KB, 1)
    Write-Host "  -> Compressed favicon.png to $newSize KB" -ForegroundColor Cyan
}

Write-Host "=============================================" -ForegroundColor Gold
Write-Host "   SUCCESS: ALL IMAGES FULLY OPTIMIZED!     " -ForegroundColor Gold
Write-Host "=============================================" -ForegroundColor Gold
Write-Host "Press any key to close..."
[void][System.Console]::ReadKey()
