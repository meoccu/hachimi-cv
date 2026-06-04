import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始初始化数据...");

  // 1. 管理员
  const adminEmail = "admin@example.com";
  const adminPass = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true },
    create: {
      email: adminEmail,
      passwordHash: adminPass,
      name: "Admin",
      isAdmin: true,
      plan: "ENTERPRISE",
      emailVerifiedAt: new Date(),
    },
  });
  console.log("✅ 管理员:", admin.email, "/ 密码: admin123456");

  // 2. 演示用户
  const demoPass = await bcrypt.hash("demo123456", 10);
  await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      passwordHash: demoPass,
      name: "Demo User",
      plan: "FREE",
      emailVerifiedAt: new Date(),
    },
  });

  // 3. 内置模板
  const templates = [
    { key: "classic", name: "经典风格", description: "简洁、稳重，适合所有行业", isPremium: false },
    { key: "modern", name: "现代极简", description: "强调留白与排版，适合互联网/设计岗", isPremium: false },
    { key: "elegant", name: "优雅深色", description: "深色调，适合产品/管理岗", isPremium: true },
    { key: "academic", name: "学术风", description: "适合科研、学术岗", isPremium: true },
    { key: "creative", name: "创意双栏", description: "适合设计师 / 创意岗", isPremium: true },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { key: t.key },
      update: { name: t.name, description: t.description, isPremium: t.isPremium },
      create: {
        ...t,
        isOfficial: true,
        isPublic: true,
        status: "PUBLISHED",
        thumbnail: `/templates/${t.key}.png`,
      },
    });
  }
  console.log(`✅ 模板: ${templates.length} 个`);

  // 4. 站点配置
  const exist = await prisma.siteConfig.findFirst();
  if (!exist) {
    await prisma.siteConfig.create({
      data: {
        siteName: "Resume Platform",
        siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        mailFrom: "no-reply@example.com",
      },
    });
  }
  console.log("✅ 站点配置已就绪");

  console.log("🎉 Seed 完成");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());