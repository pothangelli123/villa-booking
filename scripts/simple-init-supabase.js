/**
 * Simple Supabase Connection Test
 * 
 * This script verifies the connection to your Supabase project
 * and provides instructions for manual table creation.
 * 
 * Usage:
 * - Run: node scripts/simple-init-supabase.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Terminal colors for better readability
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}=== Supabase Connection Test ===${colors.reset}`);

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl) {
  console.error(`${colors.red}Error: NEXT_PUBLIC_SUPABASE_URL is not set in .env.local${colors.reset}`);
  process.exit(1);
}

if (!supabaseKey) {
  console.error(`${colors.red}Error: SUPABASE_SERVICE_KEY is not set in .env.local${colors.reset}`);
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error(`${colors.red}Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.green}Environment variables found:${colors.reset}`);
console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.slice(0, 25)}...`);
console.log(`- SUPABASE_SERVICE_KEY: ${supabaseKey.slice(0, 15)}...`);
console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.slice(0, 15)}...`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  try {
    console.log(`${colors.blue}Testing connection to Supabase...${colors.reset}`);
    
    // Simple query to test connection
    const { data, error } = await supabase.from('villas').select('*').limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, which is fine for this test
      console.log(`${colors.yellow}The 'villas' table doesn't exist yet.${colors.reset}`);
      console.log(`${colors.green}Connection to Supabase was successful!${colors.reset}`);
      
      // Print SQL for creating tables
      printTableCreationSQL();
    } else if (error) {
      console.error(`${colors.red}Error connecting to Supabase:${colors.reset}`, error.message);
      process.exit(1);
    } else {
      console.log(`${colors.green}Connection to Supabase was successful!${colors.reset}`);
      
      if (data && data.length > 0) {
        console.log(`${colors.green}Found existing data in the 'villas' table.${colors.reset}`);
      } else {
        console.log(`${colors.yellow}The 'villas' table exists but is empty.${colors.reset}`);
        printSampleDataSQL();
      }
    }
  } catch (err) {
    console.error(`${colors.red}Exception during connection test:${colors.reset}`, err.message);
    process.exit(1);
  }
}

// Print SQL for table creation
function printTableCreationSQL() {
  console.log(`\n${colors.cyan}===== SQL FOR TABLE CREATION =====${colors.reset}`);
  console.log(`${colors.yellow}To create the necessary tables, run the following SQL in the Supabase SQL Editor:${colors.reset}\n`);
  
  console.log(`${colors.blue}-- Enable UUID extension${colors.reset}`);
  console.log(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  
  console.log(`\n${colors.blue}-- Create villas table${colors.reset}`);
  console.log(`CREATE TABLE IF NOT EXISTS villas (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  max_guests integer NOT NULL,
  images text[] NOT NULL,
  amenities text[] NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);`);

  console.log(`\n${colors.blue}-- Create bookings table${colors.reset}`);
  console.log(`CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  special_requests text,
  total_amount numeric NOT NULL,
  payment_id text NOT NULL,
  villa_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now() NOT NULL
);`);

  console.log(`\n${colors.cyan}After creating the tables, you can insert sample data.${colors.reset}`);
  printSampleDataSQL();
}

// Print SQL for sample data
function printSampleDataSQL() {
  console.log(`\n${colors.cyan}===== SQL FOR SAMPLE DATA =====${colors.reset}`);
  console.log(`${colors.yellow}To insert sample data, run the following SQL in the Supabase SQL Editor:${colors.reset}\n`);
  
  console.log(`${colors.blue}-- Insert sample villa${colors.reset}`);
  console.log(`INSERT INTO villas (
  name, 
  description, 
  short_description, 
  location, 
  price, 
  bedrooms, 
  bathrooms, 
  max_guests, 
  images, 
  amenities
) VALUES (
  'Luxury Beachfront Villa',
  'Experience the ultimate luxury getaway at our stunning beachfront villa. Nestled on the pristine shores of a private beach, this exquisite property offers breathtaking ocean views from every angle.',
  'Stunning beachfront villa with private pool, direct beach access, and breathtaking ocean views.',
  'Malibu, California',
  1200.00,
  5,
  6,
  12,
  ARRAY[
    '/images/villa-exterior.jpg',
    '/images/villa-interior-1.jpg',
    '/images/villa-interior-2.jpg',
    '/images/villa-bedroom.jpg',
    '/images/villa-bathroom.jpg',
    '/images/villa-pool.jpg',
    '/images/villa-beach.jpg',
    '/images/villa-dining.jpg'
  ],
  ARRAY[
    'Private Pool',
    'Direct Beach Access',
    'Ocean View',
    'Fully Equipped Kitchen',
    'Air Conditioning',
    'Free WiFi',
    'Smart TV',
    'Outdoor Dining Area',
    'BBQ Grill',
    'Parking',
    'Gym',
    'Home Theater',
    'Laundry Facilities',
    '24/7 Security',
    'Concierge Service'
  ]
);`);
}

// Run the test
testConnection().then(() => {
  console.log(`\n${colors.green}===== NEXT STEPS =====${colors.reset}`);
  console.log(`1. Make sure to create the tables in the Supabase SQL Editor`);
  console.log(`2. Download placeholder images with: npm run download-images`);
  console.log(`3. Start the development server with: npm run dev`);
}); 