// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Queue } from 'bullmq';
import { connection } from '../../lib/connection';
import { myQueue } from '../../lib/queue/foo-queue';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
       // const myQueue = new Queue('foo', {connection});
        
        // Get the base URL for API calls
        const baseUrl = req.headers.host 
            ? `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`
            : 'http://localhost:3000';

        // Add two jobs: one to call save-bar API, one to call save-baz API
        const [barJob, bazJob] = await Promise.all([
            myQueue.add('call-save-bar', { 
                apiEndpoint: `${baseUrl}/api/save-bar`,
                method: 'POST'
            }),
            myQueue.add('call-save-baz', { 
                apiEndpoint: `${baseUrl}/api/save-baz`,
                method: 'POST'
            })
        ]);

        res.status(200).json({
            success: true,
            message: 'Both jobs added to queue successfully',
            jobs: [
              {
                jobId: barJob.id,
                name: 'call-save-bar',
              },
              {
                jobId: bazJob.id,
                name: 'call-save-baz',
              }
            ],
        });
    } catch (error: any) {
        console.error('Error triggering jobs:', error);
        res.status(500).json({ 
            error: 'Failed to trigger jobs',
            message: error.message 
        });
    }
}
