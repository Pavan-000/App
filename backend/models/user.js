import { DataTypes } from "sequelize";
import sequelize from "../db/config.js"

const User = sequelize.define("User", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
