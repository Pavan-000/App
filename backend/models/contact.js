import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";

const Contact = sequelize.define("Contact", {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Contact;
