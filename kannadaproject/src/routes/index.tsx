import { createFileRoute, Link } from "@tanstack/react-router";
import { TARGETS, offlinePack } from "@/lib/nb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Namma Baashe · Understand Kannada" },
      { name: "description", content: "Translate, scan, simplify and learn Kannada in one place." },
      { property: "og:title", content: "Namma Baashe · Understand Kannada" },
      { property: "og:description", content: "Translate, scan, simplify and learn Kannada in one place." },
    ],
  }),
  component: Home,
});

const FEATURES = [
  ["文", "Multilingual Translation", "20 languages, both ways", "/translate"],
  ["📷", "Scan Images & Documents", "Signs, menus, notices", "/scan"],
  ["▦", "QR Code Scanner", "Read & translate QR text", "/qr"],
  ["✎", "Simplify Kannada", "Official text made easy", "/simplify"],
  ["📖", "Learn Kannada Quickly", "Phrases with pronunciation", "/learn"],
  ["🎙", "Voice Translation", "Speak, get Kannada", "/tools"],
  ["🛕", "Travel & Pilgrimage", "Temples, buses, help", "/travel"],
] as const;

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="pill">ನಮ್ಮ ಭಾಷೆ · Our Language</span>
          <h1>Break Language Barriers in <span className="gold">Karnataka.</span></h1>
          <p>Translate text, scan signs and documents, simplify complicated Kannada, and learn useful phrases for everyday life.</p>
          <div className="row">
            <Link className="btn" to="/translate">Start Translating →</Link>
            <Link className="btn ghost" to="/scan">📷 Scan & Translate</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="gopura" />
          <p className="kn big">ಹತ್ತಿರದ ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?</p>
          <p className="muted">Where is the nearest bus station?</p>
        </div>
      </section>
      <section className="wrap">
        <div className="grid4">
          {FEATURES.map(([ic, t, d, u]) => (
            <Link key={t} className="card feature" to={u}><span className="ic">{ic}</span><b>{t}</b><small>{d}</small></Link>
          ))}
          <a className="card feature" href="#" onClick={(e) => { e.preventDefault(); offlinePack(); }}>
            <span className="ic">⤓</span><b>Offline Phrasebook</b><small>Download & keep</small>
          </a>
        </div>
      </section>
      <section className="wrap band">
        <h2>One Platform. Every Language. Simpler Kannada.</h2>
        <div className="grid4">
          <div className="card"><b>Tourists</b><p>Read signboards, order food and find your way.</p></div>
          <div className="card"><b>Pilgrims</b><p>Understand temple notices, darshan timings and rules.</p></div>
          <div className="card"><b>Students</b><p>Learn everyday words with clear pronunciation.</p></div>
          <div className="card"><b>From other states</b><p>Talk at work, the market and the hospital with confidence.</p></div>
        </div>
      </section>
      <section className="wrap">
        <h2>How Namma Baashe Works</h2>
        <ol className="steps">
          <li><b>1</b>Enter text, upload an image, scan a QR code, or speak.</li>
          <li><b>2</b>Select the target language or choose Simplify Kannada.</li>
          <li><b>3</b>Let the application process the content.</li>
          <li><b>4</b>Read, listen to, copy, or save the result.</li>
        </ol>
        <h2>Supported Languages</h2>
        <div className="chips">{TARGETS.map(([c, n]) => <span key={c} className="chip">{n}</span>)}</div>
      </section>
    </>
  );
}
