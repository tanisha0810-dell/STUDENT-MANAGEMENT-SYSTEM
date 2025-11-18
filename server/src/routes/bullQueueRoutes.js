import express from "express";
import { demoQueue } from "../utils/bullQueue.js";

const router = express.Router();

// POST /api/bullmq/enqueue - add a job to the queue
router.post("/enqueue", async (req, res) => {
  const { payload } = req.body;
  if (!payload) return res.status(400).json({ success: false, message: "Missing payload" });
  const job = await demoQueue.add('demo-job', { payload });
  res.json({ success: true, jobId: job.id });
});

export default router;
