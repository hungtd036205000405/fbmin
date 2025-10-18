const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

// Load env from src/.env explicitly (the project uses src/.env)
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

async function test() {
  const cfg = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'facebook_mini',
  };

  console.log('DB config values from environment:');
  console.log({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    passwordRaw: process.env.DB_PASSWORD,
    passwordType: typeof process.env.DB_PASSWORD,
    database: cfg.database,
  });

  const client = new Client(cfg);
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Connected, now():', res.rows[0]);
  } catch (err) {
    console.error('Connection error:', err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

test();
