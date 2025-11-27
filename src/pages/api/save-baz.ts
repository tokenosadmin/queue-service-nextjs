// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { connection } from '@/lib/connection';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = { qux: 'baz' };
    const key = 'baz:data';
    
    // Save data to Redis as JSON string
    await connection.set(key, JSON.stringify(data));
    
    res.status(200).json({
      success: true,
      message: 'Baz data saved to Redis',
      key: key,
      data: data,
    });
  } catch (error: any) {
    console.error('Error saving baz data:', error);
    res.status(500).json({ 
      error: 'Failed to save baz data',
      message: error.message 
    });
  }
}
