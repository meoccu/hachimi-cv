const STYLE_PROMPTS: Record<string, string> = {
  professional: "请用更专业正式的语气改写，保留全部事实，不要编造经历。",
  concise:      "请改写为简洁有力的表达，去除冗余，不要编造经历。",
  star:         "请按 STAR 法则（情境-任务-行动-结果）重新组织，不允许虚构。",
  quantified:   "请尽量保留原有事实的前提下加强可量化表达；若原文没有数字，请用括注提示用户补充，不要捏造数据。",
  english:      "请翻译并润色为地道的英文简历表达。",
};

export async function polishWithLLM(opts: {
  text: string;
  style: keyof typeof STYLE_PROMPTS | string;
}) {
  const apiUrl = process.env.LLM_API_URL!;
  const apiKey = process.env.LLM_API_KEY!;
  const model  = process.env.LLM_MODEL || "gpt-4o-mini";

  const sys =
    "你是简历润色助手。严格遵守：1) 不能编造任何用户没有提供的经历、数字、公司、职位、时间；2) 输出语言保持与输入一致，除非用户要求翻译；3) 输出纯文本或简单 Markdown，不要输出额外解释。";
  const user =
    (STYLE_PROMPTS[opts.style] || STYLE_PROMPTS.professional) +
    "\n\n以下是原文：\n" + opts.text;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      temperature: 0.5,
    }),
  });

  if (!res.ok) throw new Error(`LLM error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const out: string = data.choices?.[0]?.message?.content ?? "";
  const tokens = data.usage?.total_tokens ?? 0;
  return { text: out.trim(), tokens };
}