import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Mock payment processing
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a mock payment ID
    const paymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;

    return res.status(200).json({
      success: true,
      paymentId,
      amount,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({ error: 'Payment processing failed' });
  }
} 