import { NextApiRequest, NextApiResponse } from 'next';
import { testSupabaseConnection } from '../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await testSupabaseConnection();
      
      res.status(200).json({
        timestamp: new Date().toISOString(),
        ...result
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 