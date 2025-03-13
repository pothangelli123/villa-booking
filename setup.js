/**
 * Setup script for the Villa Booking Website
 * This script helps with initial project setup and configuration
 * 
 * Usage: node setup.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
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

// Main setup function
async function setup() {
  console.log(`\n${colors.green}${colors.bright}🏨 Villa Booking Website Setup${colors.reset}\n`);
  console.log(`${colors.magenta}This script will help you set up the villa booking website project.${colors.reset}\n`);
  
  // Project description
  console.log(`${colors.blue}${colors.bright}Project Description:${colors.reset}`);
  console.log(`A beautiful, modern direct booking website for a luxury villa, built with Next.js and Tailwind CSS.`);
  console.log(`The website features a stunning UI, multi-step booking flow, Supabase integration, and Stripe payment processing.`);
  
  console.log(`\n${colors.blue}${colors.bright}Tech Stack:${colors.reset}`);
  console.log(`- Frontend: React.js, Next.js, Tailwind CSS`);
  console.log(`- Backend: Node.js (through Next.js API routes)`);
  console.log(`- Database: Supabase`);
  console.log(`- Payment Processing: Stripe`);
  console.log(`- Animations: Framer Motion`);
  
  const confirmation = await prompt(`\n${colors.yellow}Do you want to proceed with the setup? (y/n) ${colors.reset}`);
  
  if (confirmation.toLowerCase() !== 'y') {
    console.log(`\n${colors.yellow}Setup canceled.${colors.reset}`);
    rl.close();
    return;
  }

  // Install dependencies
  console.log(`\n${colors.green}${colors.bright}📦 Installing dependencies...${colors.reset}\n`);
  
  // Check if package.json exists
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log(`${colors.yellow}No package.json found. Creating one...${colors.reset}`);
    
    // Create a basic package.json
    const packageJson = {
      name: "villa-booking",
      version: "0.1.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "setup-supabase": "node scripts/init-supabase.js"
      },
      dependencies: {
        "next": "^14.1.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "express": "^4.18.2",
        "axios": "^1.6.5",
        "tailwindcss": "^3.4.1",
        "autoprefixer": "^10.4.16",
        "postcss": "^8.4.33",
        "typescript": "^5.3.3",
        "react-datepicker": "^4.25.0",
        "react-icons": "^4.12.0",
        "stripe": "^14.11.0",
        "@supabase/supabase-js": "^2.39.3",
        "react-hot-toast": "^2.4.1",
        "framer-motion": "^10.17.0",
        "dotenv": "^16.3.1"
      },
      devDependencies: {
        "@types/node": "^20.11.5",
        "@types/react": "^18.2.48",
        "@types/react-dom": "^18.2.18",
        "@types/react-datepicker": "^4.19.5",
        "eslint": "^8.56.0",
        "eslint-config-next": "^14.1.0"
      }
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    console.log(`${colors.green}Created package.json${colors.reset}`);
  }
  
  if (!runCommand('npm install', 'Installing dependencies')) {
    console.error(`${colors.red}Failed to install dependencies. Please try again.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Environment variables
  console.log(`\n${colors.green}${colors.bright}🔒 Setting up environment variables...${colors.reset}\n`);
  
  const useSupabase = await prompt(`${colors.yellow}Do you have Supabase credentials? (y/n) ${colors.reset}`);
  
  if (useSupabase.toLowerCase() === 'y') {
    const supabaseUrl = await prompt(`${colors.yellow}Enter your Supabase URL: ${colors.reset}`);
    const supabaseAnonKey = await prompt(`${colors.yellow}Enter your Supabase Anon Key: ${colors.reset}`);
    const supabaseServiceKey = await prompt(`${colors.yellow}Enter your Supabase Service Key: ${colors.reset}`);
    
    // Create .env.local file
    const envContent = `# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_KEY=${supabaseServiceKey}

# Stripe credentials - Replace with your actual values
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
`;
    
    fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);
    console.log(`${colors.green}Created .env.local with your Supabase credentials${colors.reset}`);
    
    // Initialize Supabase
    const initSupabase = await prompt(`${colors.yellow}Do you want to initialize Supabase tables? (y/n) ${colors.reset}`);
    
    if (initSupabase.toLowerCase() === 'y') {
      console.log(`\n${colors.cyan}${colors.bright}🔧 Initializing Supabase...${colors.reset}\n`);
      console.log(`${colors.yellow}Running Supabase initialization script...${colors.reset}`);
      
      try {
        execSync('node scripts/init-supabase.js', { stdio: 'inherit' });
        console.log(`${colors.green}Supabase initialized successfully!${colors.reset}`);
      } catch (error) {
        console.error(`${colors.red}Failed to initialize Supabase. Error: ${error.message}${colors.reset}`);
        console.log(`${colors.yellow}You can run the script manually later: npm run setup-supabase${colors.reset}`);
      }
    }
  } else {
    console.log(`${colors.yellow}Skipping Supabase setup. Using placeholder environment variables.${colors.reset}`);
    
    // Create .env.local with placeholders
    if (!fs.existsSync(path.join(process.cwd(), '.env.local'))) {
      fs.copyFileSync(
        path.join(process.cwd(), '.env.example'),
        path.join(process.cwd(), '.env.local')
      );
      console.log(`${colors.green}Created .env.local with placeholder values${colors.reset}`);
    }
  }
  
  // Run development server
  const startDev = await prompt(`\n${colors.yellow}Do you want to start the development server? (y/n) ${colors.reset}`);
  
  if (startDev.toLowerCase() === 'y') {
    console.log(`\n${colors.green}${colors.bright}🚀 Starting development server...${colors.reset}\n`);
    console.log(`${colors.cyan}The website will be available at: ${colors.bright}http://localhost:3000${colors.reset}\n`);
    
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      console.error(`${colors.red}Failed to start development server. Error: ${error.message}${colors.reset}`);
    }
  } else {
    console.log(`\n${colors.green}${colors.bright}✅ Setup completed!${colors.reset}`);
    console.log(`\n${colors.cyan}To start the development server, run: ${colors.bright}npm run dev${colors.reset}`);
    console.log(`${colors.cyan}The website will be available at: ${colors.bright}http://localhost:3000${colors.reset}\n`);
  }
  
  rl.close();
}

setup(); 