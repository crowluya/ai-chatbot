import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

const runMigrate = async () => {
  // 优先使用独立的PG环境变量
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD) {
    console.log('Using separate PostgreSQL environment variables');
    
    const connection = postgres({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE || 'postgres',
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      ssl: { rejectUnauthorized: false },
      max: 1,
    });
    
    const db = drizzle(connection);
    await runMigrations(db);
    return;
  }
  
  // 回退到使用连接URL
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL or PostgreSQL credentials are not defined');
  }

  console.log('Using POSTGRES_URL environment variable');
  const connection = postgres(process.env.POSTGRES_URL, { 
    max: 1, // 迁移时使用单个连接
    ssl: { rejectUnauthorized: false } // 禁用严格的SSL证书验证
  });
  const db = drizzle(connection);
  await runMigrations(db);
};

async function runMigrations(db: any) {
  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');
  process.exit(0);
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
