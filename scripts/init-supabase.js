/**
 * Supabase Initialization Script
 * 
 * This script creates the necessary tables in your Supabase project
 * Run this script after setting up your Supabase account and project
 * 
 * Usage:
 * - Update your Supabase URL and Key in .env.local
 * - Run: node scripts/init-supabase.js
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
  cyan: '\x1b[36m',
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Fix the environment variable name to match what's in .env.local
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    `${colors.red}Error: Missing Supabase credentials in environment variables.${colors.reset}\n` +
    `Please create a .env.local file with the following variables:\n` +
    `NEXT_PUBLIC_SUPABASE_URL=your-supabase-url\n` +
    `SUPABASE_SERVICE_KEY=your-supabase-service-key\n\n` +
    `You can find these values in your Supabase project settings under API.\n` +
    `Note: Use the service role key, not the anon key, for this script.`
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL for creating tables - we'll use direct Supabase API calls instead of RPC
const createVillasTableSQL = `
CREATE TABLE IF NOT EXISTS villas (
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
);
`;

const createBookingsTableSQL = `
CREATE TABLE IF NOT EXISTS bookings (
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
);
`;

// Sample villa data
const sampleVilla = {
  name: 'Luxury Beachfront Villa',
  description: `Experience the ultimate luxury getaway at our stunning beachfront villa. Nestled on the pristine shores of a private beach, this exquisite property offers breathtaking ocean views from every angle.

The spacious interior features high ceilings, floor-to-ceiling windows, and elegant furnishings that create a perfect blend of luxury and comfort. The open-concept living area seamlessly connects to a gourmet kitchen equipped with top-of-the-line appliances, perfect for preparing delicious meals or having a private chef create culinary masterpieces.

Each bedroom is a private sanctuary with plush bedding, premium linens, and ensuite bathrooms featuring rainfall showers and deep soaking tubs. The master suite includes a private balcony where you can enjoy your morning coffee while watching the sunrise over the ocean.

Outside, the expansive deck surrounds an infinity pool that appears to merge with the ocean horizon. Lounge areas, an outdoor kitchen, and a fire pit provide perfect spaces for relaxation and entertainment. Steps from the deck lead directly to the pristine sandy beach where you can swim, snorkel, or simply relax under the sun.

Additional amenities include a home theater, a fully equipped gym, a wine cellar, and smart home technology throughout. Our dedicated concierge service is available to arrange activities, transportation, and any special requests to make your stay truly unforgettable.

Whether you're planning a family vacation, a romantic getaway, or a retreat with friends, our Luxury Beachfront Villa offers an unparalleled experience of privacy, comfort, and natural beauty.`,
  short_description: 'Stunning beachfront villa with private pool, direct beach access, and breathtaking ocean views.',
  location: 'Malibu, California',
  price: 1200.00,
  bedrooms: 5,
  bathrooms: 6,
  max_guests: 12,
  images: [
    '/images/villa-exterior.jpg',
    '/images/villa-interior-1.jpg',
    '/images/villa-interior-2.jpg',
    '/images/villa-bedroom.jpg',
    '/images/villa-bathroom.jpg',
    '/images/villa-pool.jpg',
    '/images/villa-beach.jpg',
    '/images/villa-dining.jpg'
  ],
  amenities: [
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
};

// Function to create a table directly using Supabase's REST API
async function createTable(table, sql, description) {
  console.log(`${colors.blue}Checking for ${table} table...${colors.reset}`);
  
  try {
    // First check if the table exists by trying to query it
    const { error: checkError } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    // If the table doesn't exist, create it
    if (checkError && checkError.code === '42P01') {
      console.log(`${colors.yellow}Table ${table} does not exist, creating it...${colors.reset}`);
      
      // For Supabase, we'll use their SQL API (requires enabling in the dashboard)
      // Since we can't directly execute SQL through the JS client, we'll offer instructions
      console.log(`${colors.magenta}To create the ${table} table, you need to run this SQL in the Supabase SQL Editor:${colors.reset}`);
      console.log(`\n${colors.cyan}${sql}${colors.reset}\n`);
      
      const proceed = await new Promise(resolve => {
        const readline = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        readline.question(`${colors.yellow}Have you executed this SQL in the Supabase SQL Editor? (y/n): ${colors.reset}`, answer => {
          readline.close();
          resolve(answer.toLowerCase() === 'y');
        });
      });
      
      if (!proceed) {
        console.log(`${colors.yellow}Skipping ${table} table creation.${colors.reset}`);
        return false;
      }
      
      console.log(`${colors.green}Success: ${description} completed${colors.reset}`);
      return true;
    } else if (checkError) {
      console.error(`${colors.red}Error checking if ${table} exists:${colors.reset}`, checkError.message);
      return false;
    } else {
      console.log(`${colors.green}Table ${table} already exists.${colors.reset}`);
      return true;
    }
  } catch (err) {
    console.error(`${colors.red}Exception during ${description}:${colors.reset}`, err.message);
    return false;
  }
}

// Function to insert sample villa data
async function insertSampleVilla() {
  console.log(`${colors.blue}Inserting sample villa data...${colors.reset}`);
  
  try {
    // Check if there are already villas
    const { data: existingVillas, error: checkError } = await supabase
      .from('villas')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error(`${colors.red}Error checking villas:${colors.reset}`, checkError.message);
      return false;
    }
    
    if (existingVillas && existingVillas.length > 0) {
      console.log(`${colors.yellow}Villas already exist in the database, skipping sample data.${colors.reset}`);
      return true;
    }
    
    const { data, error } = await supabase
      .from('villas')
      .insert([sampleVilla])
      .select();
    
    if (error) {
      console.error(`${colors.red}Error inserting sample villa:${colors.reset}`, error.message);
      return false;
    }
    
    console.log(`${colors.green}Success: Sample villa inserted with ID: ${data[0].id}${colors.reset}`);
    return true;
  } catch (err) {
    console.error(`${colors.red}Exception during sample villa insertion:${colors.reset}`, err.message);
    return false;
  }
}

// Main function to initialize Supabase
async function initializeSupabase() {
  console.log(`${colors.cyan}=== Initializing Supabase Database ===${colors.reset}`);
  
  // Create villas table
  const villasTableResult = await createTable(
    'villas',
    createVillasTableSQL,
    'Create villas table'
  );
  
  if (!villasTableResult) {
    console.error(`${colors.red}Failed to verify villas table. Please create it manually using the Supabase SQL Editor.${colors.reset}`);
    // Continue anyway to try other operations
  }
  
  // Create bookings table
  const bookingsTableResult = await createTable(
    'bookings',
    createBookingsTableSQL,
    'Create bookings table'
  );
  
  if (!bookingsTableResult) {
    console.error(`${colors.red}Failed to verify bookings table. Please create it manually using the Supabase SQL Editor.${colors.reset}`);
    // Continue anyway to try other operations
  }
  
  // Insert sample villa data only if both tables were successfully created or already exist
  if (villasTableResult) {
    const sampleVillaResult = await insertSampleVilla();
    
    if (!sampleVillaResult) {
      console.warn(`${colors.yellow}Warning: Failed to insert sample villa data, but tables were verified.${colors.reset}`);
    }
  }
  
  console.log(`${colors.green}=== Supabase initialization completed ===\n${colors.reset}`);
  console.log(`${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. Create placeholder images in 'public/images/' directory using: node scripts/download-images.js`);
  console.log(`2. Start your development server with 'npm run dev'`);
  console.log(`3. Visit http://localhost:3000 to see your villa booking website`);
  
  return true;
}

// Run the initialization
initializeSupabase().catch(error => {
  console.error(`${colors.red}Unhandled error during initialization:${colors.reset}`, error);
  process.exit(1);
}); 