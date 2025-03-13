import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Missing Supabase credentials',
        details: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in environment variables' 
      });
    }

    // Create Supabase client - use service key if available for more permissions
    const supabase = createClient(supabaseUrl, serviceKey || supabaseKey);

    // SQL to create the bookings table if it doesn't exist
    const createTableQuery = `
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

    // First, check if the table already exists
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'bookings');

      if (error) {
        console.error("Error checking if table exists:", error);
        // Continue anyway to try creating the table
      } else if (data && data.length > 0) {
        // Table already exists
        return res.status(200).json({ 
          message: 'Bookings table already exists', 
          created: false 
        });
      }
    } catch (checkError) {
      console.error("Error during table existence check:", checkError);
      // Continue anyway to try creating the table
    }

    // Attempt to create the table
    if (serviceKey) {
      // If we have service key, we can try to execute SQL directly
      try {
        // This requires the pg-meta extension to be enabled
        const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
            'apikey': serviceKey,
          },
          body: JSON.stringify({ query: createTableQuery }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }

        return res.status(201).json({ 
          message: 'Bookings table created successfully', 
          created: true,
          method: 'direct_sql'
        });
      } catch (sqlError) {
        console.error("Error executing direct SQL:", sqlError);
        // Fall through to try alternative methods
      }
    }

    // If service key approach fails, return the SQL for manual execution
    return res.status(400).json({
      error: 'Could not create table automatically',
      message: 'Please run the SQL in the Supabase SQL Editor',
      sql: createTableQuery
    });
  } catch (error) {
    console.error('Error in create-table API:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 