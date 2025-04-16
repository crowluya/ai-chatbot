import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
  path: '.env.local',
});

// 构建数据库连接配置
let dbCredentials: any = {
  ssl: { rejectUnauthorized: false },
};

// 优先使用独立的PG环境变量
if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD) {
  dbCredentials = {
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: { rejectUnauthorized: false },
  };
} else if (process.env.POSTGRES_URL) {
  // 使用连接URL
  dbCredentials.url = process.env.POSTGRES_URL;
} else {
  throw new Error('No database credentials found');
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials,
});
