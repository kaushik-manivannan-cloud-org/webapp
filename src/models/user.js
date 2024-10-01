import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from 'bcrypt';

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'First name must only contain alphabets.'
        },
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: {
          msg: 'Last name must only contain alphabets.'
        },
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email address is invalid.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ["^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"],
          notEmpty: true,
          msg: "Password must contain atleast 8 characters with atleast one uppercase, one lowercase, one number, and one special character."
        }
      }
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    hooks: {
      beforeCreate: async(user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async(user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    }
  }
)

export default User;