import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    ...opts,
  });
}

export async function sendVerifyEmail(to: string, link: string) {
  return sendMail({
    to,
    subject: "请验证您的邮箱",
    html: `<p>欢迎注册 Resume Platform！</p><p>请点击下方链接完成邮箱验证：</p><p><a href="${link}">${link}</a></p><p>链接 24 小时内有效。</p>`,
  });
}

export async function sendResetPasswordEmail(to: string, link: string) {
  return sendMail({
    to,
    subject: "重置您的密码",
    html: `<p>您正在重置密码。请点击下方链接：</p><p><a href="${link}">${link}</a></p><p>链接 1 小时内有效。如非本人操作请忽略。</p>`,
  });
}

export async function sendPaymentSuccessEmail(to: string, plan: string, expiresAt: Date) {
  return sendMail({
    to,
    subject: "支付成功 - 会员已开通",
    html: `<p>感谢您的购买！您的 ${plan} 会员已开通，到期时间：${expiresAt.toISOString().slice(0,10)}</p>`,
  });
}