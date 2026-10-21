import type { ReactNode } from "react";

function inlineMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded-md bg-slate-200/80 px-1.5 py-0.5 font-mono text-[0.8em] text-slate-800"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <em key={key++} className="italic text-slate-700">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "code"; text: string }
  | { type: "h"; level: 2 | 3; text: string };

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }

    if (/^###\s+/.test(line)) {
      blocks.push({ type: "h", level: 3, text: line.replace(/^###\s+/, "") });
      i += 1;
      continue;
    }
    if (/^##\s+/.test(line)) {
      blocks.push({ type: "h", level: 2, text: line.replace(/^##\s+/, "") });
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraph: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !/^#{2,3}\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "p", text: paragraph.join(" ") });
  }

  return blocks;
}

export default function AiMessageContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-2.5 text-[0.9375rem] leading-7 text-slate-700">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={index}>{inlineMarkdown(block.text)}</p>;
        }
        if (block.type === "h") {
          const Tag = block.level === 2 ? "h3" : "h4";
          return (
            <Tag
              key={index}
              className={`font-semibold tracking-tight text-slate-900 ${
                block.level === 2 ? "text-base" : "text-sm"
              }`}
            >
              {inlineMarkdown(block.text)}
            </Tag>
          );
        }
        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-xl bg-slate-900 px-3.5 py-3 font-mono text-[0.8rem] leading-6 text-slate-100"
            >
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5 marker:text-blue-500">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{inlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={index} className="list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-blue-600">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{inlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
