import { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseClient, createBooking } from '../../utils/supabase';

// Remove duplicate client creation - we'll use getSupabaseClient instead
// which handles service key vs anon key appropriately

async function processPayment(amount: number): Promise<string> {
  try {
    // In a real app, you'd call your payment processor (Stripe, etc.)
    // For now, we'll just generate a mock payment ID
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
    return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  } catch (error) {
    console.error('Payment processing error:', error);
    throw new Error('Payment processing failed');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the admin client with service role for higher permissions
  const supabase = getSupabaseClient(true); // Pass true to get admin client
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const bookingData = req.body;
    
    // Log the received data for debugging
    console.log('API received booking data:', bookingData);
    
    // Validate required fields
    const requiredFields = [
      'first_name', 
      'last_name', 
      'email', 
      'phone', 
      'check_in', 
      'check_out', 
      'guests',
      'villa_id',
      'total_amount'
    ];
    
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }
    
    // 1. Process payment first
    console.log('Processing payment for amount:', bookingData.total_amount);
    let paymentId;
    try {
      paymentId = await processPayment(bookingData.total_amount);
      console.log('Payment processed successfully:', paymentId);
    } catch (paymentError) {
      console.error('Payment processing failed:', paymentError);
      return res.status(400).json({
        success: false,
        error: 'Payment processing failed',
        details: paymentError instanceof Error ? paymentError.message : String(paymentError)
      });
    }
    
    // 2. If payment is successful, create booking
    const bookingWithPayment = {
      ...bookingData,
      payment_id: paymentId,
      status: 'confirmed', // Since payment was successful, mark as confirmed
    };
    
    console.log('Creating booking with payment ID:', paymentId);
    
    try {
      // Pass the admin client to ensure it uses the service role
      const booking = await createBooking(bookingWithPayment, supabase);
      
      // Return success response
      return res.status(201).json({ 
        success: true, 
        booking,
        payment: {
          id: paymentId,
          amount: bookingData.total_amount,
          status: 'completed'
        },
        message: 'Booking created successfully' 
      });
    } catch (bookingError) {
      console.error('Error creating booking after payment:', bookingError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create booking after successful payment',
        payment_id: paymentId,
        details: bookingError instanceof Error ? bookingError.message : String(bookingError)
      });
    }
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
} 