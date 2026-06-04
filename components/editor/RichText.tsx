"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import AiToolbar from "./AiToolbar";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  enableAi?: boolean;
}

export default function RichText({ value, onChange, placeholder, enableAi = true }: Props) {
  const [showAi, setShowAi] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "在这里输入内容..." }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2 border border-gray-200 rounded-b bg-white",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // 外部 value 变化时同步（避免 reset 光标，仅当 HTML 不一致时）
  useEffect(() => {
    if (!editor) return;
    if ((value || "") !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const btn = (active: boolean, label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-xs rounded hover:bg-gray-100 ${
        active ? "bg-gray-200 font-semibold" : ""
      }`}
    >
      {label}
    </button>
  );

  const onAddLink = () => {
    const url = window.prompt("链接 URL", "https://");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const plainText = editor.getText();

  return (
    <div className="rounded">
      <div className="flex flex-wrap items-center gap-1 border border-b-0 border-gray-200 rounded-t px-2 py-1 bg-gray-50">
        {btn(editor.isActive("bold"), "B", () => editor.chain().focus().toggleBold().run())}
        {btn(editor.isActive("italic"), "I", () => editor.chain().focus().toggleItalic().run())}
        {btn(editor.isActive("strike"), "S", () => editor.chain().focus().toggleStrike().run())}
        <span className="w-px h-4 bg-gray-300 mx-1" />
        {btn(editor.isActive("bulletList"), "• 列表", () =>
          editor.chain().focus().toggleBulletList().run()
        )}
        {btn(editor.isActive("orderedList"), "1. 列表", () =>
          editor.chain().focus().toggleOrderedList().run()
        )}
        {btn(editor.isActive("link"), "🔗", onAddLink)}
        <span className="w-px h-4 bg-gray-300 mx-1" />
        {btn(false, "↶", () => editor.chain().focus().undo().run())}
        {btn(false, "↷", () => editor.chain().focus().redo().run())}

        {enableAi && (
          <>
            <span className="flex-1" />
            <button
              type="button"
              onClick={() => setShowAi((v) => !v)}
              className="px-2 py-1 text-xs rounded bg-brand-50 text-brand-700 hover:bg-brand-100"
            >
              ✨ AI
            </button>
          </>
        )}
      </div>

      <EditorContent editor={editor} />

      {enableAi && showAi && (
        <div className="mt-2">
          <AiToolbar
            text={plainText}
            onApply={(result) => {
              editor.commands.setContent(result, true);
              onChange(editor.getHTML());
              setShowAi(false);
            }}
          />
        </div>
      )}
    </div>
  );
}