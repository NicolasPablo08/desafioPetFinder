import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connect";

export class Pet extends Model {}
Pet.init(
	{
		name: DataTypes.STRING,
		lat: DataTypes.FLOAT,
		lng: DataTypes.FLOAT,
		imageUrl: DataTypes.STRING,
		imagePublicId: DataTypes.STRING,
		lost: DataTypes.BOOLEAN,
	},
	{ sequelize, modelName: "Pet" }
);
