import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connect";

export class User extends Model {}
User.init(
	{
		email: DataTypes.STRING,
		name: DataTypes.STRING,
		localidad: DataTypes.STRING,
		passwordHash: DataTypes.STRING,
	},
	{ sequelize, modelName: "User" }
);
