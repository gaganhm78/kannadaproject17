import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { simplifyFn } from "@/lib/nb.functions";
import { OutActions } from "@/components/OutActions";

export const Route = createFileRoute("/simplify")({
  head: () => ({
    meta: [
      { title: "Simplify Kannada · Namma Baashe" },
      { name: "description", content: "Turn complicated official Kannada into simple everyday Kannada." },
      { property: "og:title", content: "Simplify Kannada · Namma Baashe" },
      { property: "og:description", content: "Turn complicated official Kannada into simple everyday Kannada." },
    ],
  }),
  component: Simplify,
});

function Simplify() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <section className="wrap narrow">
      <h1 className="center">Simplify Kannada</h1>
      <p className="center muted">Paste complicated official or literary Kannada. Get simple, everyday Kannada.</p>
      <form
        className="two"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true); setError(null);
          const r = await simplifyFn({ data: { text } });
          setBusy(false);
          if (r.error) { setError(r.error); setResult(null); } else setResult(r.result ?? "");
        }}
      >
        <div className="box">
          <textarea className="kn" value={text} onChange={(e) => setText(e.target.value)} placeholder="ಸಾರ್ವಜನಿಕರ ಗಮನಕ್ಕೆ..." />
          <button className="btn" disabled={busy}>{busy ? "Simplifying…" : "Simplify →"}</button>
        </div>
        <div className={`box out ${result ? "ok" : ""}`}>
          {error ? <p className="err">{error}</p>
            : result ? <><p className="result kn">{result}</p><OutActions out={result} lang="kn" /></>
            : <p className="muted">Simple Kannada appears here.</p>}
        </div>
      </form>
    </section>
  );
}
