import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { user } from '../lib/db/schema';

// 加载环境变量
config({
  path: '.env.local',
});

// 测试用户信息
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = 'Test123456!';

// 创建数据库连接
let client;

// 优先使用独立的PG环境变量
if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD) {
  client = postgres({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'postgres',
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: { rejectUnauthorized: false },
    max: 1
  });
} else {
  // biome-ignore lint: Forbidden non-null assertion.
  client = postgres(process.env.POSTGRES_URL!, { 
    ssl: { rejectUnauthorized: false }
  });
}

const db = drizzle(client);

async function getUser(email: string) {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

async function createTestUser() {
  try {
    console.log('开始创建测试用户...');
    
    // 检查用户是否已存在
    const existingUsers = await getUser(TEST_USER_EMAIL);
    
    if (existingUsers.length > 0) {
      console.log(`测试用户 ${TEST_USER_EMAIL} 已存在，无需创建`);
      return;
    }
    
    // 创建新用户
    await createUser(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    console.log(`成功创建测试用户: ${TEST_USER_EMAIL}, 密码: ${TEST_USER_PASSWORD}`);
    
    // 验证用户是否创建成功
    const users = await getUser(TEST_USER_EMAIL);
    if (users.length > 0) {
      console.log(`用户ID: ${users[0].id}`);
    }
    
    console.log('测试用户创建完成！');
  } catch (error) {
    console.error('创建测试用户时出错:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser(); 