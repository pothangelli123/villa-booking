/**
 * Fast Setup Script for the Villa Booking Website
 * 
 * This script helps you quickly set up the project without Supabase requirements
 * It will initialize a minimal working version that you can expand later
 * 
 * Usage: node setup-fast.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Utility function to run a command and log output
function runCommand(command, description) {
  console.log(`\n${colors.cyan}${colors.bright}⚡ ${description}${colors.reset}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ Error: ${description} failed${colors.reset}\n`);
    console.error(error.message);
    return false;
  }
}

// Function to ensure directory exists
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`${colors.blue}Creating directory: ${directory}${colors.reset}`);
    fs.mkdirSync(directory, { recursive: true });
    return true;
  }
  return false;
}

// Create placeholder images
function createPlaceholderImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  ensureDirectoryExists(imagesDir);
  
  const imageNames = [
    'villa-exterior.jpg',
    'villa-interior-1.jpg',
    'villa-interior-2.jpg',
    'villa-bedroom.jpg',
    'villa-bathroom.jpg',
    'villa-pool.jpg',
    'villa-beach.jpg',
    'villa-dining.jpg'
  ];
  
  // Create a simple HTML file pointing to placeholder images
  let html = `<!DOCTYPE html>
<html>
<head>
  <title>Villa Placeholder Images</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .image-card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .image-card img { width: 100%; height: auto; }
    .image-caption { padding: 10px; text-align: center; background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>Villa Images</h1>
  <p>These are placeholder images for the villa. Replace them with real images in the 'public/images' directory.</p>
  <div class="image-grid">
`;

  imageNames.forEach((imageName, index) => {
    const placeholder = `https://dummyimage.com/800x600/0284c7/ffffff&text=${imageName.replace('.jpg', '')}`;
    const filePath = path.join(imagesDir, imageName);
    
    // Create empty file as placeholder
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      console.log(`${colors.green}Created placeholder file: ${imageName}${colors.reset}`);
    }
    
    html += `    <div class="image-card">
      <img src="${placeholder}" alt="${imageName}" />
      <div class="image-caption">${imageName}</div>
    </div>\n`;
  });
  
  html += `  </div>
  <p>To download actual placeholder images, run: <code>npm run download-images</code></p>
</body>
</html>`;

  fs.writeFileSync(path.join(path.join(process.cwd(), 'public'), 'placeholder-gallery.html'), html);
  console.log(`${colors.green}Created placeholder gallery HTML file at public/placeholder-gallery.html${colors.reset}`);
}

// Create basic .env.local file
function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    const envContent = `# Supabase credentials - Replace with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjk2OTAyMiwiZXhwIjoxOTMyNTQ1MDIyfQ.example
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2OTY5MDIyLCJleHAiOjE5MzI1NDUwMjJ9.example

# Stripe credentials - Replace with your actual values
STRIPE_SECRET_KEY=sk_test_example
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_example
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log(`${colors.green}Created .env.local file with placeholder values${colors.reset}`);
  } else {
    console.log(`${colors.yellow}.env.local file already exists${colors.reset}`);
  }
}

// Create mock data JSON file to use instead of Supabase initially
function createMockData() {
  const dataDir = path.join(process.cwd(), 'data');
  ensureDirectoryExists(dataDir);
  
  const mockVilla = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Luxury Beachfront Villa",
    description: "Experience the ultimate luxury getaway at our stunning beachfront villa. Nestled on the pristine shores of a private beach, this exquisite property offers breathtaking ocean views from every angle.",
    short_description: "Stunning beachfront villa with private pool, direct beach access, and breathtaking ocean views.",
    location: "Malibu, California",
    price: 1200.00,
    bedrooms: 5,
    bathrooms: 6,
    max_guests: 12,
    images: [
      "/images/villa-exterior.jpg",
      "/images/villa-interior-1.jpg",
      "/images/villa-interior-2.jpg",
      "/images/villa-bedroom.jpg",
      "/images/villa-bathroom.jpg",
      "/images/villa-pool.jpg",
      "/images/villa-beach.jpg",
      "/images/villa-dining.jpg"
    ],
    amenities: [
      "Private Pool",
      "Direct Beach Access",
      "Ocean View",
      "Fully Equipped Kitchen",
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Outdoor Dining Area",
      "BBQ Grill",
      "Parking",
      "Gym",
      "Home Theater",
      "Laundry Facilities",
      "24/7 Security",
      "Concierge Service"
    ],
    created_at: new Date().toISOString()
  };
  
  const mockBookings = [];
  
  fs.writeFileSync(path.join(dataDir, 'villas.json'), JSON.stringify([mockVilla], null, 2));
  fs.writeFileSync(path.join(dataDir, 'bookings.json'), JSON.stringify(mockBookings, null, 2));
  
  console.log(`${colors.green}Created mock data files in the data directory${colors.reset}`);
}

// Create a mock API file to use instead of Supabase
function createMockApi() {
  const apiDir = path.join(process.cwd(), 'utils');
  ensureDirectoryExists(apiDir);
  
  const mockApiContent = `/**
 * Mock API utility to use instead of Supabase
 * For testing purposes until Supabase is properly set up
 */

import fs from 'fs';
import path from 'path';

let villas = [];
let bookings = [];

try {
  // In Next.js, these paths are relative to the project root
  const villasPath = path.join(process.cwd(), 'data', 'villas.json');
  const bookingsPath = path.join(process.cwd(), 'data', 'bookings.json');
  
  if (fs.existsSync(villasPath)) {
    villas = JSON.parse(fs.readFileSync(villasPath, 'utf8'));
  }
  
  if (fs.existsSync(bookingsPath)) {
    bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
  }
} catch (error) {
  console.error('Error loading mock data:', error);
}

export const mockApi = {
  villas: {
    getAll: () => Promise.resolve({ data: villas, error: null }),
    getById: (id) => {
      const villa = villas.find(v => v.id === id);
      return Promise.resolve({ 
        data: villa ? [villa] : [], 
        error: villa ? null : { message: 'Villa not found' } 
      });
    }
  },
  bookings: {
    create: (bookingData) => {
      const newBooking = {
        id: Math.random().toString(36).substring(2, 15),
        ...bookingData,
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      
      bookings.push(newBooking);
      
      // In a real app, we would save this to a file
      // But for demo purposes, we'll just keep it in memory
      return Promise.resolve({ data: newBooking, error: null });
    },
    getByEmail: (email) => {
      const userBookings = bookings.filter(b => b.email === email);
      return Promise.resolve({ data: userBookings, error: null });
    }
  }
};

// This is a placeholder for when you have actual Supabase set up
export const getSupabaseClient = () => {
  console.warn('Using mock API instead of Supabase');
  return {
    from: (table) => {
      if (table === 'villas') {
        return {
          select: () => ({
            eq: () => ({
              single: () => mockApi.villas.getById(),
              // Add more methods as needed
            }),
            // Add more methods as needed
          }),
          // Add more methods as needed
        };
      }
      
      // Add more tables as needed
      return {};
    },
    // Add more Supabase methods as needed
  };
};

export default mockApi;
`;
  
  fs.writeFileSync(path.join(apiDir, 'mockApi.js'), mockApiContent);
  console.log(`${colors.green}Created mock API utility in utils/mockApi.js${colors.reset}`);
}

// Ensure all required directories exist
function createProjectStructure() {
  const directories = [
    'components',
    'pages',
    'pages/api',
    'public',
    'public/images',
    'styles',
    'utils',
    'scripts',
    'data'
  ];
  
  directories.forEach(dir => {
    ensureDirectoryExists(dir);
  });
  
  console.log(`${colors.green}Created all required project directories${colors.reset}`);
}

// Main setup function
async function fastSetup() {
  console.log(`\n${colors.green}${colors.bright}🏨 Villa Booking Website Fast Setup${colors.reset}\n`);
  console.log(`${colors.magenta}This script will set up a minimal working version of the villa booking website.${colors.reset}\n`);
  
  const confirmation = await prompt(`${colors.yellow}Do you want to proceed with the fast setup? (y/n) ${colors.reset}`);
  
  if (confirmation.toLowerCase() !== 'y') {
    console.log(`\n${colors.yellow}Setup canceled.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Create project structure
  createProjectStructure();
  
  // Create .env.local file with placeholders
  createEnvFile();
  
  // Create placeholder images
  createPlaceholderImages();
  
  // Create mock data
  createMockData();
  
  // Create mock API utility
  createMockApi();
  
  // Install dependencies
  console.log(`\n${colors.green}${colors.bright}📦 Installing dependencies...${colors.reset}\n`);
  
  if (!runCommand('npm install', 'Installing dependencies')) {
    console.error(`${colors.red}Failed to install dependencies. Please try again manually.${colors.reset}`);
  }
  
  console.log(`\n${colors.green}${colors.bright}✅ Fast setup completed!${colors.reset}`);
  console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. Start the development server: ${colors.bright}npm run dev${colors.reset}`);
  console.log(`2. View your villa booking website at: ${colors.bright}http://localhost:3000${colors.reset}`);
  console.log(`3. When ready to connect to a real database, see: ${colors.bright}TROUBLESHOOTING.md${colors.reset}`);
  
  rl.close();
}

// Run the setup
fastSetup(); 