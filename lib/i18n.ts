import zhCN from "@/locales/zh-CN.json";
import zhTW from "@/locales/zh-TW.json";
import enUS from "@/locales/en-US.json";
import jaJP from "@/locales/ja-JP.json";
import koKR from "@/locales/ko-KR.json";

export const LOCALES = ["zh-CN","zh-TW","en-US","ja-JP","ko-KR"] as const;
export type Locale = typeof LOCALES[number];

export const messages: Record<Locale, any> = {
  "zh-CN": zhCN, "zh-TW": zhTW, "en-US": enUS, "ja-JP": jaJP, "ko-KR": koKR,
};

export function t(locale: Locale, path: string) {
  return path.split(".").reduce((o, k) => o?.[k], messages[locale]) ?? path;
}