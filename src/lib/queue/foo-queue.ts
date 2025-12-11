import { Queue, QueueEvents} from 'bullmq';
import { Worker, Job } from 'bullmq';
import { connection } from '../connection';

export const myQueue = new Queue('foo', {connection});

const queueEvents = new QueueEvents("foo");

const worker = new Worker(
  'foo',
  async (job) => {
    const { apiEndpoint, method } = job.data;
    
    // Check if this is an API call job
    if (apiEndpoint) {
      console.log(`Calling API: ${apiEndpoint}`);
      
      // Make HTTP request to the API endpoint
      const response = await fetch(apiEndpoint, {
        method: method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`API call result:`, result);
      
      return result;
    } else {
      // Fallback for old job format (just log data)
      console.log(job.data);
      return job.data;
    }
  },
  { connection },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on('failed', (job: any, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});