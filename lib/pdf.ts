import puppeteer, { Browser } from "puppeteer";

let _browser: Browser | null = null;

async function getBrowser() {
  if (_browser && _browser.connected) return _browser;
  _browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
    ],
  });
  return _browser;
}

export async function renderResumePdf(opts: {
  url: string;          // 例如 http://localhost:3000/resume/print/xxx
  cookie?: string;      // 鉴权所需 cookie
  watermark?: boolean;
}): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    if (opts.cookie) {
      const u = new URL(opts.url);
      await page.setCookie({
        name: process.env.COOKIE_NAME || "rp_token",
        value: opts.cookie,
        domain: u.hostname,
        path: "/",
        httpOnly: true,
      });
    }
    await page.goto(opts.url, { waitUntil: "networkidle0", timeout: 60_000 });
    await page.emulateMediaType("print");

    const headerTemplate = `<div></div>`;
    const footerTemplate = opts.watermark
      ? `<div style="font-size:10px;color:#bbb;width:100%;text-align:center;">由 Resume Platform 生成 · 免费版</div>`
      : `<div></div>`;

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "12mm", right: "12mm" },
      displayHeaderFooter: !!opts.watermark,
      headerTemplate,
      footerTemplate,
    });
    return pdf as Buffer;
  } finally {
    await page.close();
  }
}