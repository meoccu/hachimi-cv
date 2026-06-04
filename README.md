# Resume Platform

一个开箱即用的在线简历管理平台。

## 技术栈
- Next.js 14 (App Router) + TypeScript
- Prisma + PostgreSQL + Redis
- TipTap 富文本编辑器
- Puppeteer PDF 导出
- Tailwind CSS + Chart.js
- Stripe / 微信支付
- GitHub OAuth / 微信扫码登录
- LLM (OpenAI 兼容接口) 简历润色

## 快速开始

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run seed