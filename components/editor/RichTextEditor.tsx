"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import DOMPurify from "isomorphic-dompurify";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer nofollow" } }),
    ],
    content: value,
    editorProps: {
      transformPastedHTML: (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }),
      attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[120px]" },
    },
    onUpdate: ({ editor }) => {
      const html = DOMPurify.sanitize(editor.getHTML());
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value);
  }, [value]);

  if (!editor) return null;
  const Btn = ({ active, onClick, children }: any) => (
    <button type="button" onClick={onClick}
      className={`px-2 py-1 text-sm rounded ${active ? "bg-gray-800 text-white" : "bg-gray-100"}`}>
      {children}
    </button>
  );

  return (
    <div className="border rounded">
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>B</Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>I</Btn>
        <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</Btn>
        <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</Btn>
        <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn onClick={() => {
          const url = prompt("链接 URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}>Link</Btn>
      </div>
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}