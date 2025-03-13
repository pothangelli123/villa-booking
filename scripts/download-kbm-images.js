const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Create the directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Created directory:', imagesDir);
}

// KBM Resort villa images from property #981
// These are placeholder URLs - you need to replace them with the actual image URLs
// from the KBM Resorts website
const imageUrls = [
  // Replace these with the actual image URLs from the KBM Resorts website
  "https://example.com/kbm-villa-exterior.jpg",
  "https://example.com/kbm-villa-interior-1.jpg",
  "https://example.com/kbm-villa-interior-2.jpg",
  "https://example.com/kbm-villa-bedroom.jpg",
  "https://example.com/kbm-villa-bathroom.jpg",
  "https://example.com/kbm-villa-pool.jpg"
];

// File names to save the images as
const fileNames = [
  'villa-exterior.jpg',
  'villa-interior-1.jpg',
  'villa-interior-2.jpg',
  'villa-bedroom.jpg',
  'villa-bathroom.jpg',
  'villa-pool.jpg'
];

// Number of files downloaded
let downloadedCount = 0;

console.log('Starting download of KBM villa images...');

// Function to download an image
function downloadImage(url, fileName) {
  const filePath = path.join(imagesDir, fileName);
  
  // For demonstration purposes, we'll create empty placeholder files if URLs aren't provided
  if (url.startsWith('https://example.com')) {
    console.log(`⚠️ Placeholder URL detected for ${fileName}`);
    console.log(`Creating an empty placeholder file: ${filePath}`);
    
    // Create an empty file as a placeholder
    fs.writeFileSync(filePath, '');
    
    downloadedCount++;
    if (downloadedCount === fileNames.length) {
      console.log('\n✅ Placeholder files created for all images.');
      console.log('\n⚠️ IMPORTANT: You need to manually replace these with actual images from:');
      console.log('https://www.kbmresorts.com/vacation-rentals/981');
      console.log('\nPlease right-click on each image on the KBM website and "Save Image As..."');
      console.log(`Save them to: ${imagesDir}`);
      
      // Open the images directory for the user
      try {
        console.log('\nOpening the images directory...');
        if (process.platform === 'win32') {
          execSync(`explorer "${imagesDir}"`);
        } else if (process.platform === 'darwin') {
          execSync(`open "${imagesDir}"`);
        } else {
          execSync(`xdg-open "${imagesDir}"`);
        }
      } catch (error) {
        console.log('Could not open the images directory automatically.');
      }
    }
    return;
  }
  
  // Download real image if URL is provided
  const file = fs.createWriteStream(filePath);
  https.get(url, (response) => {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${fileName}`);
      
      downloadedCount++;
      if (downloadedCount === fileNames.length) {
        console.log('\n✅ All images downloaded successfully!');
      }
    });
  }).on('error', (err) => {
    fs.unlinkSync(filePath);
    console.error(`❌ Error downloading ${fileName}:`, err.message);
  });
}

// Download each image
for (let i = 0; i < imageUrls.length; i++) {
  downloadImage(imageUrls[i], fileNames[i]);
}

console.log('\n⚠️ Since I cannot access web content directly, you will need to:');
console.log('1. Visit https://www.kbmresorts.com/vacation-rentals/981');
console.log('2. Right-click on each image and select "Save Image As..."');
console.log(`3. Save them to: ${imagesDir}`);
console.log('4. Name them according to the placeholders created by this script'); 