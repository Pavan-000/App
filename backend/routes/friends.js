import express from "express";
import { supabase } from "../db/supabaseClient.js";
import { requireFields } from "../utils/validators.js";

const router = express.Router();

/**
 * POST /api/friends
 * Body: { userId, friendEmail }
 * Adds friendship both directions (if not exists)
 */
router.post("/", async (req, res) => {
  const err = requireFields(req.body, ["userId", "friendEmail"]);
  if (err) return res.status(400).json({ error: err });

  const { userId, friendEmail } = req.body;

  try {
    // find friend user
    const { data: friendUser, error: friendErr } = await supabase
      .from("users")
      .select("*")
      .eq("email", friendEmail)
      .maybeSingle();

    if (friendErr) return res.status(500).json({ error: friendErr.message });
    if (!friendUser) return res.status(404).json({ error: "User with that email not found" });

    if (friendUser.id === Number(userId)) {
      return res.status(400).json({ error: "Cannot add yourself as friend" });
    }

    // Insert both directions using upsert-style approach to avoid duplicates
    const inserts = [
      { user_id: Number(userId), friend_id: friendUser.id },
      { user_id: friendUser.id, friend_id: Number(userId) }
    ];

    // We will insert and ignore conflicts by unique constraint if present
    const { error: insertErr } = await supabase
      .from("friends")
      .insert(inserts, { returning: "minimal" });

    if (insertErr && !/duplicate key value violates unique constraint/i.test(insertErr.message)) {
      // If it's not just a duplicate key error, return
      return res.status(500).json({ error: insertErr.message });
    }

    return res.json({ message: "Friend added (if not already)", friend: friendUser });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/friends/:userId
 * Returns array of friend user objects
 */
router.get("/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) return res.status(400).json({ error: "Invalid userId" });

  try {
    // get friend ids
    const { data: friendRows, error: fErr } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", userId);

    if (fErr) return res.status(500).json({ error: fErr.message });

    const friendIds = (friendRows || []).map(r => r.friend_id);
    if (friendIds.length === 0) return res.json([]);

    const { data: friends, error: usersErr } = await supabase
      .from("users")
      .select("id,name,email")
      .in("id", friendIds);

    if (usersErr) return res.status(500).json({ error: usersErr.message });

    return res.json(friends);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
