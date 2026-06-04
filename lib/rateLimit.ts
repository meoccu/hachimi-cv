import { redis } from "./redis";

/** key 为每日维度计数器 */
export async function checkDailyLimit(key: string, limit: number) {
  const day = new Date().toISOString().slice(0, 10);
  const k = `rl:${key}:${day}`;
  const n = await redis.incr(k);
  if (n === 1) await redis.expire(k, 60 * 60 * 26);
  return { allowed: n <= limit, used: n, limit };
}