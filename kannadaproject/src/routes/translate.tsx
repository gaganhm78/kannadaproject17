import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LANGUAGES, TARGETS, listen } from "@/lib/nb";
import { translateFn } from "@/lib/nb.functions";
import { OutActions } from "@/components/OutActions";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "Translate · Namma Baashe" },
      { name: "description", content: "Translate between Kannada and 19 other languages." },
      { property: "og:title", content: "Translate · Namma Baashe" },
      { property: "og:description", content: "Translate between Kannada and 19 other languages." },
    ],
  }),
  component: Translate,
});

function Translate() {
  const [src, setSrc] = useState("en");
  const [tgt, setTgt] = useState("kn");
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const r = await translateFn({ data: { text, src, tgt } });
    setBusy(false);
    if (r.error) { setError(r.error); setResult(null); } else setResult(r.result ?? "");
  }

  return (
    <section className="wrap narrow">
      <h1 className="center">Translate Across 20 Languages</h1>
      <p className="center muted">Type, speak or paste text. Any language to any language.</p>
      <form onSubmit={go} className="panel">
        <div className="langbar">
          <select value={src} onChange={(e) => setSrc(e.target.value)} aria-label="Source language">
            {Object.entries(LANGUAGES).map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
          <button type="button" className="icon round" title="Swap languages" onClick={() => { if (src !== "auto") { setSrc(tgt); setTgt(src); } }}>⇄</button>
          <select value={tgt} onChange={(e) => setTgt(e.target.value)} aria-label="Target language">
            {TARGETS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </div>
        <div className="two">
          <div className="box">
            <textarea maxLength={5000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Where is the nearest bus station?" />
            <div className="actions">
              <button type="button" className="icon" onClick={() => listen(src === "auto" ? "en" : src, setText)}>🎙 Speak</button>
              <button type="button" className="icon" onClick={async () => setText(await navigator.clipboard.readText())}>📋 Paste</button>
              <button type="button" className="icon" onClick={() => setText("")}>✕ Clear</button>
              <span className="count">{text.length}/5000</span>
              <button className="btn" disabled={busy}>{busy ? "Translating…" : "Translate →"}</button>
            </div>
          </div>
          <div className={`box out ${result ? "ok" : ""}`}>
            {error ? <p className="err">{error}</p>
              : result ? <><p className={`result ${tgt === "kn" ? "kn" : ""}`}>{result}</p><OutActions out={result} lang={tgt} /></>
              : <p className="muted">Your translation appears here.</p>}
          </div>
        </div>
      </form>
    </section>
  );
}
