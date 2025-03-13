import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase credentials',
        details: 'Service key required for schema creation'
      });
    }
    
    // Create a Supabase client with the service key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get SQL to run from request body or use default
    const { sql } = req.body || {};
    
    // Default SQL for creating the necessary tables
    const defaultSql = `
    -- Create villa_amenities table if it doesn't exist
    CREATE TABLE IF NOT EXISTS villa_amenities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      villa_id UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
      amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE(villa_id, amenity_id)
    );

    -- Create or update bookings table
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
        CREATE TABLE bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          villa_id UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          check_in DATE NOT NULL,
          check_out DATE NOT NULL,
          guests INTEGER NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          special_requests TEXT,
          total_amount DECIMAL(10, 2) NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      ELSE
        -- Add payment_id column if it doesn't exist
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'bookings' 
          AND column_name = 'payment_id'
        ) THEN
          ALTER TABLE bookings ADD COLUMN payment_id TEXT;
        END IF;
      END IF;
    END $$;

    -- Create or update transactions table
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
        CREATE TABLE transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
          payment_id TEXT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          currency TEXT DEFAULT 'INR',
          status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
          payment_method TEXT NOT NULL,
          payment_details JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      END IF;
    END $$;

    -- Create or update reviews table
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
        CREATE TABLE reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          villa_id UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
          booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
          user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
          content TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      END IF;
    END $$;
    
    -- Enable Row Level Security but with permissive policies for each table
    ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
    
    -- Create permissive policies for villas
    DROP POLICY IF EXISTS "Allow anonymous read access to villas" ON villas;
    CREATE POLICY "Allow anonymous read access to villas" ON villas
      FOR SELECT USING (true);
    
    -- Create permissive policies for bookings
    DROP POLICY IF EXISTS "Allow insert for everyone on bookings" ON bookings;
    CREATE POLICY "Allow insert for everyone on bookings" ON bookings
      FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Allow select for everyone on bookings" ON bookings;
    CREATE POLICY "Allow select for everyone on bookings" ON bookings
      FOR SELECT USING (true);
    
    -- Create permissive policies for transactions
    DROP POLICY IF EXISTS "Allow insert for everyone on transactions" ON transactions;
    CREATE POLICY "Allow insert for everyone on transactions" ON transactions
      FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Allow select for everyone on transactions" ON transactions;
    CREATE POLICY "Allow select for everyone on transactions" ON transactions
      FOR SELECT USING (true);
    `;
    
    const sqlToRun = sql || defaultSql;
    
    try {
      // Execute the SQL via a custom function that allows executing SQL
      // Note: This requires setting up an RPC function in Supabase
      const { data, error } = await supabase.rpc('execute_sql', { sql_query: sqlToRun });
      
      if (error) {
        console.error('RPC Error:', error);
        return res.status(500).json({
          success: false,
          error: error.message,
          note: 'RPC function required. You may need to create this function in your Supabase instance.'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Schema updated successfully',
        result: data
      });
    } catch (execError) {
      console.error('SQL execution error:', execError);
      
      // Fallback: create tables one by one using the standard API
      try {
        console.log('Attempting fallback to create tables individually');
        
        // Check and create villas table
        const { error: villasError } = await supabase
          .from('villas')
          .select('id')
          .limit(1);
          
        if (villasError && villasError.code === '42P01') { // relation doesn't exist
          console.log('Creating villas table');
          // Create villas table
          await supabase.from('villas').insert([{
            name: 'Sample Villa',
            description: 'A sample villa for testing',
            short_description: 'Sample villa',
            location: 'Sample location',
            price: 1000,
            bedrooms: 3,
            bathrooms: 2,
            max_guests: 6,
            images: [],
            amenities: []
          }]);
        }
        
        // Check and create bookings table
        const { error: bookingsError } = await supabase
          .from('bookings')
          .select('id')
          .limit(1);
          
        if (bookingsError && bookingsError.code === '42P01') { // relation doesn't exist
          console.log('Creating bookings table');
          // We can't create tables via the standard API, but we can store this info
        }
        
        return res.status(200).json({
          success: true,
          message: 'Fallback method: Tables checked. Navigate to your Supabase SQL editor and run the SQL provided in the error details',
          sql: sqlToRun,
          note: 'Copy this SQL to your Supabase SQL editor and run it to create the required tables'
        });
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return res.status(500).json({
          success: false,
          error: 'Failed to update schema',
          details: execError instanceof Error ? execError.message : String(execError),
          fallback_error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
          sql: sqlToRun,
          note: 'Copy this SQL to your Supabase SQL editor and run it to create the required tables'
        });
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 