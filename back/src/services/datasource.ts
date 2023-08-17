import { DataSource } from "typeorm";
import { User } from "../entities/userEntity";
import { Note } from "../entities/noteEntity";

const datasource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: "postgres",
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Note],
  logging: ["query", "error"],
});

export default datasource;
