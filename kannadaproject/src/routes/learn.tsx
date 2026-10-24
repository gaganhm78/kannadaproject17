import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PHRASES, speak } from "@/lib/nb";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Kannada · Namma Baashe" },
      { name: "description", content: "Everyday Kannada words and phrases with pronunciation and audio." },
      { property: "og:title", content: "Learn Kannada · Namma Baashe" },
      { property: "og:description", content: "Everyday Kannada words and phrases with pronunciation and audio." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const cats = Object.keys(PHRASES);
  const [cat, setCat] = useState<string>(cats[0] ?? "");
  return (
    <section className="wrap">
      <h1 className="center">Learn Kannada in a Simple Way</h1>
      <p className="center muted">Everyday words and phrases with pronunciation.</p>
      <div className="learn">
        <aside>
          {cats.map((c) => (
            <a key={c} href="#" className={c === cat ? "active" : ""} onClick={(e) => { e.preventDefault(); setCat(c); }}>{c}</a>
          ))}
        </aside>
        <div className="card">
          <h2>{cat}</h2>
          <table>
            <thead><tr><th>English</th><th>Kannada</th><th>Pronunciation</th><th>Audio</th></tr></thead>
            <tbody>
              {(PHRASES[cat] ?? []).map((p) => (
                <tr key={p.en}><td>{p.en}</td><td className="kn">{p.kn}</td><td className="muted">{p.pr}</td>
                  <td><button className="icon" onClick={() => speak(p.kn, "kn")}>🔊</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
