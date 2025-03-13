/**
 * Image Download Helper Script
 * 
 * This script downloads placeholder images for the villa to use in development
 * It creates the required directory structure and downloads images from Unsplash or placeholder services
 * 
 * Usage:
 * - Run: node scripts/download-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Terminal colors for better readability
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Image sources (from Unsplash and other free sources)
const imageUrls = {
  'villa-exterior.jpg': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80',
  'villa-interior-1.jpg': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  'villa-interior-2.jpg': 'https://images.unsplash.com/photo-1617104678098-de229db51182?w=1200&q=80',
  'villa-bedroom.jpg': 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=1200&q=80',
  'villa-bathroom.jpg': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
  'villa-pool.jpg': 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=1200&q=80',
  'villa-beach.jpg': 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&q=80',
  'villa-dining.jpg': 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80',
};

// Function to ensure directory exists
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`${colors.blue}Creating directory: ${directory}${colors.reset}`);
    fs.mkdirSync(directory, { recursive: true });
    return true;
  }
  return false;
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.blue}Downloading: ${filename}...${colors.reset}`);
    
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        fs.unlink(filename, () => {});
        reject(new Error(`Failed to download ${filename}: Status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(() => {
          console.log(`${colors.green}Successfully downloaded: ${filename}${colors.reset}`);
          resolve();
        });
      });
      
      file.on('error', (err) => {
        fs.unlink(filename, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Function to generate a placeholder image if download fails
function generatePlaceholderImage(filename, width = 1200, height = 800, text) {
  console.log(`${colors.yellow}Generating placeholder for: ${filename}...${colors.reset}`);
  
  const imageName = path.basename(filename, path.extname(filename));
  const placeholderUrl = `https://dummyimage.com/${width}x${height}/0284c7/ffffff&text=${text || imageName.replace(/-/g, '+')}`;
  
  return downloadImage(placeholderUrl, filename);
}

// Main function to download all images
async function downloadVillaImages() {
  console.log(`${colors.cyan}=== Downloading Villa Images ===${colors.reset}`);
  
  // Ensure images directory exists
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  ensureDirectoryExists(imagesDir);
  
  // Download all images
  for (const [imageName, url] of Object.entries(imageUrls)) {
    const imagePath = path.join(imagesDir, imageName);
    
    // Skip if image already exists
    if (fs.existsSync(imagePath)) {
      console.log(`${colors.yellow}${imageName} already exists, skipping...${colors.reset}`);
      continue;
    }
    
    try {
      await downloadImage(url, imagePath);
    } catch (error) {
      console.error(`${colors.red}Error downloading ${imageName}:${colors.reset}`, error.message);
      console.log(`${colors.yellow}Will try to generate a placeholder instead...${colors.reset}`);
      
      try {
        // Extract image type from filename (e.g., "villa-pool" from "villa-pool.jpg")
        const imageType = imageName.replace('villa-', '').replace('.jpg', '');
        await generatePlaceholderImage(imagePath, 1200, 800, `Luxury+Villa+${imageType.replace(/-/g, '+')}`);
      } catch (placeholderError) {
        console.error(`${colors.red}Failed to generate placeholder for ${imageName}:${colors.reset}`, placeholderError.message);
      }
    }
  }
  
  console.log(`${colors.green}=== Image download process completed ===${colors.reset}`);
  console.log(`${colors.cyan}Images have been saved to: ${imagesDir}${colors.reset}`);
  console.log(`${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. Run 'npm run dev' to start the development server`);
  console.log(`2. Visit http://localhost:3000 to see your villa booking website with images`);
}

// Run the download process
downloadVillaImages().catch(error => {
  console.error(`${colors.red}Unhandled error during image download:${colors.reset}`, error);
  process.exit(1);
}); 