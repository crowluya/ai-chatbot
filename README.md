<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Chat SDK</h1>
</a>

<p align="center">
    Chat SDK is a free, open-source template built with Next.js and the AI SDK that helps you quickly build powerful chatbot applications.
</p>

<p align="center">
  <a href="https://chat-sdk.dev"><strong>Read Docs</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - 支持 OpenAI 兼容 API 的服务（如 Google AI 的 Gemini 模型）
  - Supports xAI, OpenAI, Fireworks, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Neon Serverless Postgres](https://vercel.com/marketplace/neon) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [Auth.js](https://authjs.dev)
  - Simple and secure authentication

## Model Providers

原模板使用[xAI](https://x.ai) `grok-2-1212`作为默认聊天模型。现在已修改为使用 OpenAI 兼容 API，可以轻松接入任何符合 OpenAI API 格式的模型，如[Google Gemini](https://ai.google.dev/)。通过[AI SDK](https://sdk.vercel.ai/docs)，您可以轻松切换 LLM 提供者。

如果要配置您自己的模型，请修改`.env`文件中的以下变量：

```
OPENAI_API_KEY=您的API密钥
OPENAI_MODEL=您想使用的模型ID（如google/gemini-flash-1.5）
OPENAI_COMPLETION_URL=API端点URL
```

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET&envDescription=Generate%20a%20random%20secret%20to%20use%20for%20authentication&envLink=https%3A%2F%2Fgenerate-secret.vercel.app%2F32&project-name=my-awesome-chatbot&repository-name=my-awesome-chatbot&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel&demo-url=https%3A%2F%2Fchat.vercel.ai&products=%5B%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22ai%22%2C%22productSlug%22%3A%22grok%22%2C%22integrationSlug%22%3A%22xai%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22protocol%22%3A%22storage%22%2C%22productSlug%22%3A%22neon%22%2C%22integrationSlug%22%3A%22neon%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various AI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000).

## 项目修改记录

本项目基于 Vercel 的 Chat SDK 模板，进行了以下主要修改：

### 1. AI 模型提供者

- 从 xAI (grok-2-1212) 切换到 OpenAI 兼容 API
- 配置为使用 Google Gemini 模型 (google/gemini-flash-1.5)
- 使用`compatibility: 'compatible'`模式确保兼容性
- 为不支持的功能（如图像生成）提供模拟实现

### 2. 数据库配置

- 集成 Supabase PostgreSQL 数据库
- 添加双重数据库连接支持：URL 和单独环境变量
- 配置 SSL 证书验证选项以确保连接安全
- 添加适当的连接池设置优化性能

### 3. 测试用户创建

- 提供脚本创建测试用户
- 用户凭据:
  - 邮箱: test@example.com
  - 密码: Test123456!
- 脚本位置: `scripts/create-test-user.ts`

### 4. 环境变量配置

```
# OpenAI兼容API配置
OPENAI_API_KEY=您的API密钥
OPENAI_MODEL=google/gemini-flash-1.5
OPENAI_COMPLETION_URL=https://generativelanguage.googleapis.com/v1

# Supabase PostgreSQL连接
POSTGRES_URL=您的数据库连接URL
# 或使用单独的连接参数
PGHOST=您的数据库主机
PGPORT=您的数据库端口
PGDATABASE=您的数据库名称
PGUSER=您的数据库用户名
PGPASSWORD=您的数据库密码
PGSSLMODE=require
```
