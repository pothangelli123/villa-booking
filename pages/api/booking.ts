import { NextApiRequest, NextApiResponse } from 'next';
import { createBooking } from '../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    
    // If payment_id is missing, generate a temporary one
    if (!bookingData.payment_id) {
      bookingData.payment_id = `pid-${Date.now()}`;
    }
    
    // Set status to pending if not provided
    if (!bookingData.status) {
      bookingData.status = 'pending';
    }
    
    // Create the booking in Supabase
    const booking = await createBooking(bookingData);
    
    // Return success response
    return res.status(201).json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
} 