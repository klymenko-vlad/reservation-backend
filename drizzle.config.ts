import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const getDbCredentials = () => {
  if (process.env.DATABASE_URL) {
    return { url: process.env.DATABASE_URL };
  }

  const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
  };

  return {
    host: requireEnv('POSTGRES_HOST'),
    port: Number(requireEnv('POSTGRES_PORT')),
    user: requireEnv('POSTGRES_USER'),
    password: requireEnv('POSTGRES_PASSWORD'),
    database: requireEnv('POSTGRES_DB'),
    ssl: false,
  };
};

export default defineConfig({
  schema: './src/database/schema/**/*.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: getDbCredentials(),
});