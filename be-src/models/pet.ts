import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connect";

export class Pet extends Model {}
Pet.init(
	{
		name: DataTypes.STRING,
		location: DataTypes.STRING,
		imageUrl: DataTypes.STRING,
		lost: DataTypes.BOOLEAN,
	},
	{ sequelize, modelName: "Pet" }
);
