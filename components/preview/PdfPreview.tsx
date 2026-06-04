"use client";
import { useEffect, useRef, useState } from "react";
// 需要 pnpm add pdfjs-dist
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PdfPreview({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.2);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pdf = await pdfjsLib.getDocument(url).promise;
      if (cancelled) return;
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className = "shadow mb-4";
        containerRef.current.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
      }
    })();
    return () => { cancelled = true; };
  }, [url, scale]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button className="btn" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>-</button>
        <span>{Math.round(scale * 100)}%</span>
        <button className="btn" onClick={() => setScale(s => Math.min(3, s + 0.2))}>+</button>
        <a className="btn ml-auto" href={url} download>下载</a>
      </div>
      <div ref={containerRef} className="flex flex-col items-center" />
    </div>
  );
}