"use client";
import { useEffect } from "react";
import ResumeTemplate from "@/components/templates/ResumeTemplate";

export default function PublicResumeView({ resume }: { resume: any }) {
  useEffect(() => {
    const start = Date.now();
    fetch(`/api/share/${resume.slug}/view`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referer: document.referrer }),
    });
    return () => {
      navigator.sendBeacon?.(`/api/share/${resume.slug}/view`, JSON.stringify({ durationMs: Date.now() - start }));
    };
  }, [resume.slug]);

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto b