import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";

const Message = sequelize.define("Message", {
  sender_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Message;
