import IORedis from 'ioredis';

// export const connection = new IORedis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     maxRetriesPerRequest: null,
// });


export const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD, // Required for Upstash
    tls: process.env.REDIS_HOST?.includes('upstash') ? {} : undefined, // Enable TLS for Upstash
    maxRetriesPerRequest: null,
});