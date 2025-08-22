// index.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import sequelize from "./db/config.js"
import { User, Contact, Message } from "./models/index.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { Op } from "sequelize";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => res.send("Backend running ✅"));

let onlineUsers = new Map();

// Socket.IO integration
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("join", async (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    // Add user to DB if not exists
    await User.findOrCreate({
      where: { id: userId },
      defaults: { name: userId },
    });

    console.log(`🟢 User joined: ${userId}`);
  });

  socket.on("addContact", async ({ userId, contactId }) => {
    await Contact.findOrCreate({
      where: { user_id: userId, contact_id: contactId },
    });
    console.log(`✔️ Contact added: ${userId} -> ${contactId}`);
  });

  socket.on("getContacts", async (userId, cb) => {
    try {
      const contacts = await Contact.findAll({ where: { user_id: userId } });
      cb(contacts.map((c) => c.contact_id));
    } catch {
      cb([]);
    }
  });

  socket.on("sendMessage", async (msg) => {
    const { senderId, receiverId, message } = msg;

    await Message.create({ sender_id: senderId, receiver_id: receiverId, message });

    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", msg);
    }
  });

  socket.on("getMessages", async ({ userId, contactId }, cb) => {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: contactId },
          { sender_id: contactId, receiver_id: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });
    cb(messages);
  });

  socket.on("disconnect", () => {
    for (let [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Connect DB and start server
sequelize
  .authenticate()
  .then(() => {
    console.log("🟢 Database connected");
    return sequelize.sync(); // Ensure models are in DB
  })
  .then(() => {
    server.listen(PORT, () =>
      console.log(`🚀 Server with Socket.IO running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err.message);
  });
