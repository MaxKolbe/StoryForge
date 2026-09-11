import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from './env.validation.js';
import { Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

const appPool = new Pool({
  connectionString: env.PG_DATABASE,
});

@Injectable()
export class Database {
  private readonly pool = appPool;

  async connect() {
    try {
      const client = await this.pool.connect();
      client.release();

      Logger.log(
        'Connected to database Pool successfully',
        'Database Connection',
      );
    } catch (err) {
      Logger.error(err, 'Failed to connect to database');
      process.exit(1);
    }

    this.pool.on('error', (err: Error, client: PoolClient) => {
      Logger.error(err, 'Unexpected error on idle client');
    });
  }

  exec(){
    const db = drizzle({ client: this.pool });

    return db;
  }
}
