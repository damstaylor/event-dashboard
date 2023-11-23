import { Model, DataTypes } from "sequelize";
import database from "../util/database.js";
class Event extends Model {}
Event.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "events",
  }
);

export default Event;
