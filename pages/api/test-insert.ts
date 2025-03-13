import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Log environment variable status to debug
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
    
    console.log('Testing direct SQL insertion with Supabase');
    console.log('Environment variables:', {
      urlExists: !!supabaseUrl,
      serviceKeyExists: !!supabaseServiceKey,
      urlLength: supabaseUrl?.length || 0,
      serviceKeyLength: supabaseServiceKey?.length || 0
    });
    
    // We need the service key for direct SQL
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase credentials',
        message: 'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables',
        variables: {
          urlExists: !!supabaseUrl,
          serviceKeyExists: !!supabaseServiceKey
        }
      });
    }
    
    // Create Supabase client with service key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('Checking database connection...');
    
    // Try to create a test transaction
    const testTransaction = {
      payment_id: `test_payment_${Date.now()}`,
      amount: 100,
      status: 'completed',
      payment_method: 'credit_card',
      payment_details: { test: true }
    };
    
    // First try the standard API
    const { data: apiData, error: apiError } = await supabase
      .from('transactions')
      .insert([testTransaction])
      .select();
      
    // Log the results of the API attempt
    console.log('API insertion attempt:', {
      success: !apiError,
      data: apiData,
      error: apiError
    });
    
    // Try to insert a test booking
    const testBooking = {
      villa_id: '550e8400-e29b-41d4-a716-446655440000',
      check_in: new Date().toISOString().split('T')[0],
      check_out: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      guests: 2,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '1234567890',
      special_requests: 'Test booking from API',
      total_amount: 500,
      status: 'confirmed',
      payment_id: `test_booking_${Date.now()}`
    };
    
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert([testBooking])
      .select();
      
    console.log('Booking insertion attempt:', {
      success: !bookingError,
      data: bookingData,
      error: bookingError
    });
    
    // Return response with all attempts
    return res.status(200).json({
      success: !apiError || !bookingError,
      transaction_attempt: {
        success: !apiError,
        data: apiData,
        error: apiError ? apiError.message : null
      },
      booking_attempt: {
        success: !bookingError,
        data: bookingData,
        error: bookingError ? bookingError.message : null
      },
      message: (apiError && bookingError) 
        ? 'All insertion methods failed'
        : 'At least one insertion method succeeded',
      suggestion: apiError || bookingError 
        ? 'Check Row Level Security (RLS) policies and table constraints in your Supabase project'
        : null
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 