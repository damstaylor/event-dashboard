import { Model, DataTypes } from "sequelize";
import database from "../util/database.js";
import User from "./User.js";
class Code extends Model {}
Code.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "codes",
  }
);

Code.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

User.hasMany(Code);
export default Code;
