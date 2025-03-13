import { NextApiRequest, NextApiResponse } from 'next';
const mockApi = require('../../utils/mockApi');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const result = await mockApi.getBookings();
        return res.status(200).json(result.data);
      
      case 'POST':
        const { villaId, checkInDate, checkOutDate, guestName, guestEmail, numGuests } = req.body;
        
        // Basic validation
        if (!villaId || !checkInDate || !checkOutDate || !guestName || !guestEmail || !numGuests) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const booking = await mockApi.createBooking(req.body);
        return res.status(201).json(booking.data);
      
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 