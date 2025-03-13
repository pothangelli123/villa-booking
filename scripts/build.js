/**
 * Production build script for the villa booking site
 * 
 * Usage: 
 * 1. Make sure you have your environment variables set
 * 2. Run this script with: node scripts/build.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

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

// Main build function
async function buildForProduction() {
  console.log(`\n${colors.green}${colors.bright}🏗️  Building Villa Booking Website for Production${colors.reset}\n`);
  
  // Check for .env.local file
  if (!fs.existsSync(path.join(process.cwd(), '.env.local'))) {
    console.log(`${colors.yellow}${colors.bright}⚠️  Warning: .env.local file not found${colors.reset}`);
    console.log(`${colors.yellow}Creating a default .env.local file with placeholder values${colors.reset}`);
    
    // Copy .env.example to .env.local
    if (fs.existsSync(path.join(process.cwd(), '.env.example'))) {
      fs.copyFileSync(
        path.join(process.cwd(), '.env.example'),
        path.join(process.cwd(), '.env.local')
      );
    } else {
      // Create a minimal .env.local
      fs.writeFileSync(
        path.join(process.cwd(), '.env.local'),
        '# Placeholder environment variables - Replace with actual values\n' +
        'NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co\n' +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key\n' +
        'SUPABASE_SERVICE_KEY=your-supabase-service-key\n' +
        'STRIPE_SECRET_KEY=sk_test_your_secret_key\n' +
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key\n'
      );
    }
  }
  
  // Install dependencies
  if (!runCommand('npm install', 'Installing dependencies')) {
    process.exit(1);
  }
  
  // Lint the codebase
  console.log(`\n${colors.cyan}${colors.bright}🧹 Linting code${colors.reset}`);
  runCommand('npm run lint', 'Linting code');
  
  // Build the project
  if (!runCommand('npm run build', 'Building production bundle')) {
    process.exit(1);
  }
  
  console.log(`\n${colors.green}${colors.bright}✅ Build completed successfully!${colors.reset}`);
  console.log(`\n${colors.cyan}To start the production server, run:${colors.reset}`);
  console.log(`\n${colors.bright}npm start${colors.reset}`);
}

buildForProduction(); 