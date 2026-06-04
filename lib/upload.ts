import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import path from "node:path";

const ENABLED = !!(process.env.S3_BUCKET && process.env.S3_REGION && process.env.S3_ACCESS_KEY_ID);

const s3 = ENABLED
  ? new S3Client({
      region: process.env.S3_REGION!,
      endpoint: process.env.S3_ENDPOINT,           // 兼容 R2 / 阿里 OSS / MinIO
      forcePathStyle: !!process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  : null;

const BUCKET = process.env.S3_BUCKET!;
const PUBLIC_BASE = process.env.S3_PUBLIC_BASE_URL ?? "";   // 例如 CDN 域名
const MAX_BYTES = 5 * 1024 * 1024;                          // 5MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];

export interface UploadResult {
  url: string;
  key: string;
  size: number;
  contentType: string;
}

/**
 * 直接上传（服务端接收 File / Buffer）
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  opts: { contentType: string; filename?: string; folder?: string; userId?: string }
): Promise<UploadResult> {
  if (!ENABLED || !s3) throw new Error("对象存储未配置 (S3_BUCKET 等环境变量)");
  if (!ALLOWED.includes(opts.contentType)) throw new Error("不支持的文件类型");
  if (file.byteLength > MAX_BYTES) throw new Error(`文件超过 ${MAX_BYTES / 1024 / 1024}MB`);

  const ext = opts.filename ? path.extname(opts.filename) : guessExt(opts.contentType);
  const folder = opts.folder ?? "uploads";
  const date = new Date().toISOString().slice(0, 10);
  const key = [folder, opts.userId ?? "anon", date, `${nanoid(16)}${ext}`].join("/");

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: opts.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: PUBLIC_BASE ? `${PUBLIC_BASE.replace(/\/$/, "")}/${key}` : `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
    size: file.byteLength,
    contentType: opts.contentType,
  };
}

/**
 * 生成前端直传的预签名 URL（推荐用于大文件 / 减轻服务器压力）
 */
export async function createPresignedPutUrl(opts: {
  contentType: string;
  folder?: string;
  userId?: string;
  expiresIn?: number;
}): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  if (!ENABLED || !s3) throw new Error("对象存储未配置");
  if (!ALLOWED.includes(opts.contentType)) throw new Error("不支持的文件类型");

  const ext = guessExt(opts.contentType);
  const folder = opts.folder ?? "uploads";
  const date = new Date().toISOString().slice(0, 10);
  const key = [folder, opts.userId ?? "anon", date, `${nanoid(16)}${ext}`].join("/");

  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: opts.contentType });
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: opts.expiresIn ?? 300 });
  const publicUrl = PUBLIC_BASE
    ? `${PUBLIC_BASE.replace(/\/$/, "")}/${key}`
    : `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, key, publicUrl };
}

function guessExt(ct: string) {
  return ({
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "application/pdf": ".pdf",
  } as Record<string, string>)[ct] ?? "";
}

export const uploadConfig = {
  enabled: ENABLED,
  maxBytes: MAX_BYTES,
  allowedTypes: ALLOWED,
};