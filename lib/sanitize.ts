import sanitizeHtml from "sanitize-html";

// 富文本：允许常见排版标签
export function cleanRichText(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["b","strong","i","em","u","p","br","ul","ol","li","h1","h2","h3","h4","a","blockquote","code","pre","span"],
    allowedAttributes: {
      a: ["href","title","target","rel"],
      span: ["class"],
    },
    allowedSchemes: ["http","https","mailto"],
    transformTags: {
      a: (tag, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
    },
  });
}

// 模板 HTML：更严格，但允许更多结构标签
export function cleanTemplateHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "div","section","header","footer","main","article","aside",
      "h1","h2","h3","h4","h5","h6","p","span","strong","em","b","i","u",
      "ul","ol","li","table","thead","tbody","tr","td","th",
      "img","a","br","hr"
    ],
    allowedAttributes: {
      "*": ["class","style","id","data-*"],
      a: ["href","title","target","rel"],
      img: ["src","alt","width","height"],
    },
    allowedSchemes: ["http","https","data","mailto"],
    disallowedTagsMode: "discard",
    // 禁止 onXxx 事件 - sanitize-html 默认会丢弃
  });
}

// 简单 CSS 清洗：禁止 expression / javascript / @import
export function cleanCss(css: string) {
  let s = css;
  s = s.replace(/@import[^;]*;?/gi, "");
  s = s.replace(/expression\s*\(/gi, "");
  s = s.replace(/javascript\s*:/gi, "");
  s = s.replace(/behavior\s*:/gi, "");
  s = s.replace(/url\(\s*['"]?\s*javascript:/gi, "");
  return s;
}