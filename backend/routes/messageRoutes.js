import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/:user1/:user2", getMessages);

export default router;
