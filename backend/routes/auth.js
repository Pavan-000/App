import express from "express";
import { supabase } from "../db/supabaseClient.js";
import { requireFields } from "../utils/validators.js";

const router = express.Router();

/**
 * POST /api/auth
 * Body: { name, email, password }
 * If user exists -> check password, return user (401 if password incorrect)
 * If not exists -> create user and return user
 */
router.post("/", async (req, res) => {
  const err = requireFields(req.body, ["name", "email", "password"]);
  if (err) return res.status(400).json({ error: err });

  const { name, email, password } = req.body;

  try {
    const { data: foundUsers, error: selectErr } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (selectErr) return res.status(500).json({ error: selectErr.message });

    if (foundUsers && foundUsers.length > 0) {
      const user = foundUsers[0];
      if (user.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }
      return res.json({ user });
    }

    // create new user
    const { data: createdUsers, error: insertErr } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select()
      .single();

    if (insertErr) return res.status(500).json({ error: insertErr.message });

    return res.status(201).json({ user: createdUsers });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
