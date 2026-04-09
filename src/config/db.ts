import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * List of required environment variables for database connection.
 * @type {string[]}
 */

const requiredEnv = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

/**
 * Validates that all required environment variables are defined.
 * Throws an error if any variable is missing.
 */

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

/**
 * PostgreSQL connection pool instance.
 *
 * This pool manages multiple client connections to the database
 * and should be reused across the application for efficiency.
 *
 * @type {Pool}
 *
 * @property {string} host - Database host address
 * @property {number} port - Database port number
 * @property {string} user - Database username
 * @property {string} password - Database password
 * @property {string} database - Database name
 */

export const pool = new Pool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});