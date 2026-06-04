import type { ResumeContent } from "@/types/resume";
import Classic from "./Classic";
import Modern from "./Modern";
import Elegant from "./Elegant";
import Academic from "./Academic";
import Creative from "./Creative";

export interface TemplateProps {
  content: ResumeContent;
  watermark?: string;
}

const REGISTRY: Record<string, React.ComponentType<TemplateProps>> = {
  classic: Classic,
  modern: Modern,
  elegant: Elegant,
  academic: Academic,
  creative: Creative,
};

export function getTemplate(key?: string | null) {
  return REGISTRY[key ?? "classic"] ?? Classic;
}

export default function TemplateRenderer({
  templateKey,
  content,
  watermark,
}: { templateKey?: string | null; content: ResumeContent; watermark?: string }) {
  const Comp = getTemplate(templateKey);
  return <Comp content={content} watermark={watermark} />;
}

export { Classic, Modern, Elegant, Academic, Creative };