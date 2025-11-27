// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Queue, QueueEvents} from 'bullmq';
import { Worker, Job } from 'bullmq';
import { myQueue } from '@/lib/queue/foo-queue';
import { connection } from '../../lib/connection';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {

        const myQueue = new Queue('foo', {connection});
        const [bar, baz] = await Promise.all([
            myQueue.add('bar', { foo: 'bar' }),
            myQueue.add('baz', { qux: 'baz' })
        ]);
        const worker = new Worker(
            'foo',
            async job => { 
            // Will print { foo: 'bar'} for the first job
            // and { qux: 'baz' } for the second.
              console.log(job.data);
            },
            { connection },
          );
          
          worker.on('completed', job => {
          console.log(`${job.id} has completed!`);
          });
          
          worker.on('failed', (job: any, err) => {
          console.log(`${job.id} has failed with ${err.message}`);
          });

        res.status(200).json({
            success: true,
            message: 'Both jobs triggered successfully',
            jobs: [
              {
                jobId: bar,
              },
              {
                jobId: baz,
              }
            ],
        });
    } catch (error) {
        console.error('Error triggering jobs:', error);
        res.status(500).json({ error: 'Failed to trigger jobs' });
    }
  
  
}
