import User  from "../models/user.js";

export const createUser = async (req, res) => {
  const { id, name } = req.body;
  try {
    const user = await User.create({ id, name });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
