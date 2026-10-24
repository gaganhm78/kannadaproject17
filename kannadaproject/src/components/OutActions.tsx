import { useState } from "react";
import { downloadText, speak } from "@/lib/nb";

export function OutActions({ out, lang }: { out: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="actions">
      <button type="button" className="icon" onClick={() => navigator.clipboard.writeText(out).then(() => setCopied(true))}>
        {copied ? "✓ Copied" : "⧉ Copy"}
      </button>
      <button type="button" className="icon" onClick={() => speak(out, lang)}>🔊 Listen</button>
      <button
        type="button"
        className="icon"
        onClick={() => {
          const f = JSON.parse(localStorage["nbFavs"] || "[]");
          f.unshift(out);
          localStorage["nbFavs"] = JSON.stringify(f.slice(0, 30));
          setSaved(true);
        }}
      >
        {saved ? "♥ Saved" : "♡ Save"}
      </button>
      <button type="button" className="icon" onClick={() => (navigator.share ? navigator.share({ text: out }) : navigator.clipboard.writeText(out))}>↗ Share</button>
      <button type="button" className="icon" onClick={() => downloadText(out)}>⤓ Download</button>
    </div>
  );
}
