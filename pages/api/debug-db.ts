import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Create a Supabase client with the service role key for admin access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_KEY as string
    );
    
    // Check RLS status
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('check_rls_status', {
        table_name: 'bookings'
      });
    
    // Test direct insert
    const { data: insertData, error: insertError } = await supabase
      .from('bookings')
      .insert({
        villa_id: null, // This will be overridden
        check_in: new Date().toISOString(),
        check_out: new Date(Date.now() + 86400000).toISOString(),
        guests: 2,
        first_name: 'Debug',
        last_name: 'Test',
        email: 'debug@test.com',
        phone: '1234567890',
        total_amount: 100,
        status: 'testing'
      })
      .select();
      
    // Get a count of rows
    const { data: countData, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' });
      
    return res.status(200).json({
      message: 'Database diagnostic information',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKeyExists: !!process.env.SUPABASE_SERVICE_KEY,
      rls: {
        data: rlsData,
        error: rlsError ? rlsError.message : null,
      },
      insert: {
        success: !insertError,
        data: insertData,
        error: insertError ? insertError.message : null
      },
      count: {
        data: countData ? countData.length : 0,
        error: countError ? countError.message : null
      }
    });
  } catch (error) {
    console.error('Debug DB error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    });
  }
} 