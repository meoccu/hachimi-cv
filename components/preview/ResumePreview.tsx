"use client";
import DOMPurify from "isomorphic-dompurify";

export default function ResumePreview({ html, css }: { html: string; css?: string }) {
  return (
    <div className="resume-frame border bg-white p-8 shadow">
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
    </div>
  );
}