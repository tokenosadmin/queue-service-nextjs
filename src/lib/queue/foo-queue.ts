import { Queue, QueueEvents} from 'bullmq';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import IORedis from 'ioredis';
import { connection } from '../connection';

// const connection = new IORedis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: parseInt(process.env.REDIS_PORT || '6379'),
//   maxRetriesPerRequest: null,
// });
// let url = process.env.REDIS_HOST as string

//const connection = new Redis(url)

export const myQueue = new Queue('foo', {connection});

const queueEvents = new QueueEvents("foo");

// async function addJobs() {
//   await myQueue.add('bar', { foo: 'bar' });
//   await myQueue.add('baz', { qux: 'baz' });
// }

// queueEvents.on('progress', ({ jobId, data }, timestamp) => {
//   console.log(`${jobId} reported progress ${data} at ${timestamp}`);
// });

// queueEvents.on('waiting', ({ jobId }) => {
//   console.log(`A job with ID ${jobId} is waiting`);
// });

// queueEvents.on('active', ({ jobId, prev }) => {
//   console.log(`Job ${jobId} is now active; previous status was ${prev}`);
// });

// queueEvents.on('completed', ({ jobId, returnvalue }) => {
//   console.log(`${jobId} has completed and returned ${returnvalue}`);
// });

// queueEvents.on('failed', ({ jobId, failedReason }) => {
//   console.log(`${jobId} has failed with reason ${failedReason}`);
// });

//await addJobs();

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