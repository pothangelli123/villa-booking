# KBM Resorts Villa Site Setup Guide

## Getting Images from KBM Resorts Website

1. **Run the image placeholder creator script**:
   
   ```powershell
   Set-Location -Path "D:\Telegram Desktop\Booking\villa-booking"
   npm run download-kbm-images
   ```

   This will create placeholder files in the `/public/images/` directory and open the folder for you.

2. **Download actual images from KBM Resorts**:
   
   - Visit https://www.kbmresorts.com/vacation-rentals/981
   - Right-click on each villa image and select "Save Image As..."
   - Save each image to the `/public/images/` directory using these filenames:
     - `villa-exterior.jpg`
     - `villa-interior-1.jpg`
     - `villa-interior-2.jpg`
     - `villa-bedroom.jpg` 
     - `villa-bathroom.jpg`
     - `villa-pool.jpg`

3. **Update placeholder image references (optional)**:
   
   If you want to move away from the placeholder.com images, edit the `index.tsx` file and update the `images` array:

   ```typescript
   images: [
     "/images/villa-exterior.jpg",
     "/images/villa-interior-1.jpg",
     "/images/villa-interior-2.jpg",
     "/images/villa-bedroom.jpg",
     "/images/villa-bathroom.jpg",
     "/images/villa-pool.jpg"
   ]
   ```

## Running the Development Server

```powershell
Set-Location -Path "D:\Telegram Desktop\Booking\villa-booking"
npm run dev
```

Or use the PowerShell script:

```powershell
.\run-dev.ps1
```

Visit http://localhost:3000 in your browser to see the site with actual KBM Resorts villa images.

## Important Notes

- Make sure to properly credit KBM Resorts on your website
- For a production site, ensure you have permission to use their images
- Consider setting up proper SEO tags and meta information to improve search rankings 