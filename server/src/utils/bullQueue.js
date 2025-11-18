import pkg from 'bullmq';
const { Queue, Worker } = pkg;

const connection = {
  host: '127.0.0.1',
  port: 6379,
};

// Create a queue instance
export const demoQueue = new Queue('demo-queue', { connection });

// Worker to process jobs (can be run in a separate process)
export const startDemoWorker = (processFn) => {
  return new Worker('demo-queue', processFn, { connection });
};
