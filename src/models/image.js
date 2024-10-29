import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Image = sequelize.define(
  'Image',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upload_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      }
    },
  },
  {
    tableName: 'images',
    timestamps: false,
  }
);

Image.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasOne(Image, {
  foreignKey: 'user_id'
});

export default Image;