import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
	process.env.SEQUELIZE_URL ||
		"postgresql://neondb_owner:npg_RblSr8goOM2i@ep-polished-violet-acmaqxn1-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
);
