import { startDemoWorker } from "./utils/bullQueue.js";

// Worker function to process jobs
startDemoWorker(async (job) => {
  console.log(`[BullMQ Worker] Processing job ${job.id}:`, job.data);
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`[BullMQ Worker] Done with job ${job.id}`);
});
