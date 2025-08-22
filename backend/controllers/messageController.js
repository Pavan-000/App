import  Message  from "../models/message.js";
import { Op } from "sequelize";

export const sendMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const msg = await Message.create({ sender_id, receiver_id, message });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: user1, receiver_id: user2 },
          { sender_id: user2, receiver_id: user1 },
        ],
      },
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
