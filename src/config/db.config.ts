import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from "./env.validation.js";
import { Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';



const pool = new Pool({
  connectionString: env.PG_DATABASE,
});

export async function connectDatabase() {
  try {
    const client = await pool.connect();
    client.release();

    Logger.log("Connected to database Pool successfully", "Database Connection");
  } catch (err) {
    Logger.error(err, "Failed to connect to database");
    process.exit(1);
  }
}

pool.on("error", (err: Error, client: PoolClient) => {
  Logger.error(err, "Unexpected error on idle client")
});

export const db = drizzle({ client: pool });
