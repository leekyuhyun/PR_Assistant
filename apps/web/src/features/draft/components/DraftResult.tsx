import { useState } from "react";
import type { PullRequestDraft } from "@pullwise/shared";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, RefreshCw } from "lucide-react";

type Props = {
  draft: PullRequestDraft;
  onChange: (draft: PullRequestDraft) => void;
  onRegenerate: () => void;
};

export function DraftResult({ draft, onChange, onRegenerate }: Props) {
  const [tab, setTab] = useState<"preview" | "markdown">("preview");
  const [copied, setCopied] = useState(false);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(`# ${draft.title}\n\n${draft.markdown}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="result">
      <div className="result-head">
        <div>
          <span className="overline">DRAFT READY</span>
          <h2>{draft.title}</h2>
          <p>{draft.summary}</p>
        </div>
        <button className="copy" onClick={copyMarkdown}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "복사됨" : "Markdown 복사"}
        </button>
      </div>
      <div className="metrics">
        <span>{draft.commits} commits</span>
        <span>{draft.filesChanged} files</span>
        <span className="plus">+{draft.additions}</span>
        <span className="minus">−{draft.deletions}</span>
      </div>
      <div className="tabs">
        <button
          className={tab === "preview" ? "active" : ""}
          onClick={() => setTab("preview")}
        >
          미리보기
        </button>
        <button
          className={tab === "markdown" ? "active" : ""}
          onClick={() => setTab("markdown")}
        >
          Markdown
        </button>
        <button className="regenerate" onClick={onRegenerate}>
          <RefreshCw size={14} /> 다시 생성
        </button>
      </div>
      {tab === "preview" ? (
        <article className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {draft.markdown}
          </ReactMarkdown>
        </article>
      ) : (
        <textarea
          className="editor"
          value={draft.markdown}
          onChange={(event) =>
            onChange({ ...draft, markdown: event.target.value })
          }
          aria-label="PR Markdown 편집기"
        />
      )}
    </section>
  );
}
