# Sonapahar Farmhouse Resort Website

An immersive, premium, and modern single-page website built for **Sonapahar Farmhouse Resort** located in Mirsharai, Chattogram, Bangladesh. This website serves as a high-end digital window to the resort, showcasing its unique environment (home to Bangladesh's first Miyawaki Forest), luxury eco-villas, organic dining, and natural lakes.

---

## 🌲 Features & UX Highlights

- **Aesthetics & Theme**: High-end forest-inspired color palette (Evergreen `#003E1F`, Seafoam `#D5F2E3`, Sage `#ABC8A2`, and Gold accents `#C5A880`) matching a luxury eco-conscious resort.
- **Dynamic Hero Header**: Immersive parallax background with high-end typography ("Where Nature Reclaims Her Throne") and an interactive thumbnail slide-carousel.
- **Interactive Sanctuary Showcase**: Responsive layout highlighting the resort story, natural pool, and organic environment.
- **Residences Panel**: Interactive Tab Switcher demonstrating the luxury villas (**Akash House** ৳12,500, **Kusum House** ৳14,000, and **Madhavilata Suite** ৳18,500) with details, pricing, and direct reserve actions.
- **Horizontal Gallery Ribbon**: Seamless three-tier photo ribbon with endless motion, edge-fades, and a lightbox gallery for detailed media views.
- **Advanced Booking Engine**: 
  - Custom glassmorphic selects (no raw browser-native dropdown selects).
  - Live cost calculator (calculates taxes, VAT, duration, and guest rates dynamically).
  - Complete verification flow with success modals and concierge notifications.
- **Interactive Map & Directions**: Embedded Google Maps locator with directions CTA, customized travel details (Road, Air, Rail), and elegant contact details.
- **Responsive & Premium Layout**: Zero-dependencies, built purely with optimized semantic HTML, modern CSS variables, and native vanilla JavaScript.

---

## 🚀 How to Run Locally

You can run this project locally using any of these simple methods:

### Method 1: VS Code Live Server (Recommended)
1. Open the folder `Sonapahar Website` in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Click the **Go Live** button at the bottom-right corner of the editor.
4. It will launch the site at `http://127.0.0.1:5500/` automatically.

### Method 2: Python HTTP Server (Built-in)
If you have Python installed, open PowerShell or Terminal in the project directory and run:
```bash
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your web browser.

### Method 3: Node.js (npx)
If you have Node.js installed, open terminal in the folder and run:
```bash
npx http-server -p 3000
```
Then visit [http://localhost:3000](http://localhost:3000).

---

## 🖼️ Optimizing Thumbnails & Favicons for Sharing
To ensure the website shows a beautiful thumbnail when shared on WhatsApp, Facebook, or other platforms:

1. Right-click the `compress_assets.ps1` file inside this directory and select **"Run with PowerShell"**.
2. This script uses Windows' built-in .NET tools to:
   - Crop and compress your high-res hero image (`villa-exterior-akash.jpeg`) into `og-thumbnail.jpg` (formatted perfectly to `1200x630` pixels and compressed under **300KB**). This satisfies WhatsApp's strict size limits.
   - Shrink your heavy `favicon.png` file (currently ~760KB) to a standard **32x32** browser-friendly favicon (under **5KB**).
3. Host the folder online. The OpenGraph meta tags in `index.html` are configured to automatically fetch these compressed files!

---

## 🌐 Free Hosting Options

### 1. Netlify (Drag and Drop)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this entire `Sonapahar Website` folder into the box.
3. Your website is instantly live! You can configure a custom domain or custom URL in settings.

### 2. Vercel (CLI or GitHub Link)
1. Commit the repository to GitHub.
2. Link your GitHub account to [vercel.com](https://vercel.com).
3. Import the repository, select "Other" as the framework preset, and click **Deploy**.

### 3. GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Settings** > **Pages** inside your repository.
3. Under **Build and deployment**, set the source to `Deploy from a branch`, choose `main` or `master` branch, and click **Save**.
