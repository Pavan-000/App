import express from "express";
import { supabase } from "../db/supabaseClient.js";
import { requireFields } from "../utils/validators.js";

const router = express.Router();

/**
 * POST /api/messages
 * Body: { senderId, receiverId, content }
 * Save message and return it
 * We'll expect the main server to broadcast via socket.io after insertion
 */
router.post("/", async (req, res) => {
  const err = requireFields(req.body, ["senderId", "receiverId", "content"]);
  if (err) return res.status(400).json({ error: err });

  const { senderId, receiverId, content } = req.body;

  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([{ sender_id: Number(senderId), receiver_id: Number(receiverId), content }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // Return saved message
    return res.status(201).json({ message: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/messages/:user1/:user2
 * Returns conversation between user1 and user2 sorted by created_at asc
 */
router.get("/:user1/:user2", async (req, res) => {
  const user1 = Number(req.params.user1);
  const user2 = Number(req.params.user2);
  if (!user1 || !user2) return res.status(400).json({ error: "Invalid user ids" });

  try {
    const condition = `and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(condition)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
