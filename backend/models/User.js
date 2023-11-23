import { Model, DataTypes } from "sequelize";
import database from "../util/database.js";
import Event from "./Event.js";
class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    phone_number: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_connected: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: database,
    modelName: "users",
  }
);

User.belongsTo(Event, {
  foreignKey: {
    allowNull: false,
  },
});

Event.hasMany(User);

export default User;
