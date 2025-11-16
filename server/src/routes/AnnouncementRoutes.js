import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// CREATE ANNOUNCEMENT
router.post("/", async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.json({ success: true, announcement });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET ALL ANNOUNCEMENTS
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE ANNOUNCEMENT
router.delete("/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
