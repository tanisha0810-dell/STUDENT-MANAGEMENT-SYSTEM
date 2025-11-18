import { demoQueue } from "../utils/bullQueue.js";
import { connectRedis } from "../utils/redisClient.js";

async function demo() {
  console.log("\n--- BullMQ Demo ---\n");
  await connectRedis();
  // Enqueue 3 jobs
  for (let i = 1; i <= 3; i++) {
    const job = await demoQueue.add('demo-job', { payload: `BullMQ message ${i}` });
    console.log(`Enqueued: BullMQ message ${i} | Job ID: ${job.id}`);
  }
  console.log("\nNow run: node src/bullWorker.js in another terminal to see jobs processed.\n");
  process.exit(0);
}

demo();
