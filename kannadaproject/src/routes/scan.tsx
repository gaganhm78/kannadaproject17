import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LANGUAGES, TARGETS } from "@/lib/nb";
import { translateFn } from "@/lib/nb.functions";
import { OutActions } from "@/components/OutActions";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan & Translate · Namma Baashe" },
      { name: "description", content: "Read text from photos of signs, menus and notices, then translate it." },
      { property: "og:title", content: "Scan & Translate · Namma Baashe" },
      { property: "og:description", content: "Read text from photos of signs, menus and notices, then translate it." },
    ],
  }),
  component: Scan,
});

function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [tgt, setTgt] = useState("kn");
  const [extracted, setExtracted] = useState("");
  const [detected, setDetected] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function translate(t: string) {
    setStatus("Translating…");
    const r = await translateFn({ data: { text: t, src: "auto", tgt } });
    setStatus(null);
    if (r.error) return setError(r.error);
    setDetected(r.detected ? LANGUAGES[r.detected] || r.detected : "Unknown");
    setResult(r.result ?? "");
  }

  async function scan(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) return setError("Please choose a photo first.");
    setStatus("Reading text from image… (first time may take a minute)");
    try {
      const { default: Tesseract } = await import("tesseract.js");
      const { data } = await Tesseract.recognize(file, "kan+eng+hin+tel+tam+mal+mar");
      const t = data.text.trim();
      if (!t) { setStatus(null); return setError("No text found. Try a clearer, well-lit photo."); }
      setExtracted(t);
      await translate(t);
    } catch {
      setStatus(null);
      setError("Couldn't read this image. Try a JPG or PNG photo.");
    }
  }

  return (
    <section className="wrap narrow">
      <h1 className="center">Scan & Translate</h1>
      <p className="center muted">Upload a photo of a signboard, menu or notice. We extract the text and translate it.</p>
      <form onSubmit={scan} className="panel">
        <label className="drop">
          <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <span className="ic">⇪</span><b>Tap to upload or take a photo</b>
          <small>JPG or PNG · max 10 MB</small>
        </label>
        <div className="row center-row">
          <label>Translate to{" "}
            <select value={tgt} onChange={(e) => setTgt(e.target.value)}>
              {TARGETS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
            </select>
          </label>
          <button className="btn" disabled={!!status}>Scan & Translate →</button>
        </div>
        {status && <p className="center muted">{status}</p>}
      </form>
      {error && <p className="err">{error}</p>}
      {extracted && (
        <div className="two">
          <div className="box">
            <small className="label">Detected text ({detected}) — you can correct it</small>
            <textarea value={extracted} onChange={(e) => setExtracted(e.target.value)} />
            <button type="button" className="btn ghost" onClick={() => translate(extracted)}>Re-translate</button>
          </div>
          <div className="box out ok">
            <small className="label">{LANGUAGES[tgt]} translation</small>
            <p className="result">{result}</p>
            {result && <OutActions out={result} lang={tgt} />}
            {detected === "Kannada" && <Link className="btn ghost" to="/simplify">Simplify this Kannada →</Link>}
          </div>
        </div>
      )}
      <h3>Works with</h3>
      <div className="chips">
        {["Signboards", "Temple boards", "Bus & rail boards", "Menus", "Notices", "Documents", "Handwritten notes", "Screenshots"].map((w) => <span key={w} className="chip">{w}</span>)}
      </div>
    </section>
  );
}
