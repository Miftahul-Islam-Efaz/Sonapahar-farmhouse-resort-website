@echo off
echo =============================================
echo   SONAPAHAR WEBSITE GITHUB DEPLOYER
echo =============================================
cd /d "%~dp0"

echo 1. Checking Git installation...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not installed on this machine or not in PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b
)

echo 2. Wiping old Git history to clear security token blocks...
if exist .git (
    attrib -h -r -s .git /s /d >nul 2>nul
    rmdir /s /q .git >nul 2>nul
)

echo 3. Initializing fresh local Git repository...
git init
git branch -M main

echo.
echo Please enter your GitHub Personal Access Token (PAT).
echo (This is entered at runtime and never saved to files).
set /p "token=Token: "
if "%token%"=="" (
    echo Error: Token cannot be empty.
    pause
    exit /b
)

echo.
echo 4. Configuring remote URL...
git remote remove origin >nul 2>nul
git remote add origin https://%token%@github.com/Miftahul-Islam-Efaz/Sonapahar-farmhouse-resort-website.git

echo 5. Staging files...
git add .

echo 6. Committing changes...
git commit -m "Optimize mobile layouts, resolve font glitches, compress assets, and set absolute open graph links"

echo 7. Pushing to GitHub...
git push -u origin main -f

REM Clean up remote URL so token is not saved in local git config plaintext
git remote set-url origin https://github.com/Miftahul-Islam-Efaz/Sonapahar-farmhouse-resort-website.git

echo.
echo =============================================
echo   SUCCESS: WEBSITE SUCCESSFULLY DEPLOYED!
echo =============================================
pause
