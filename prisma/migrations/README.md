# Migrations

执行：

```bash
# 开发环境（生成迁移并应用）
npx prisma migrate dev --name init

# 生产环境（仅应用已有迁移）
npx prisma migrate deploy