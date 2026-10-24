import { createFileRoute } from "@tanstack/react-router";
import { PHRASES, speak } from "@/lib/nb";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "Travel & Pilgrimage · Namma Baashe" },
      { name: "description", content: "Kannada phrases for temples, buses and emergencies." },
      { property: "og:title", content: "Travel & Pilgrimage · Namma Baashe" },
      { property: "og:description", content: "Kannada phrases for temples, buses and emergencies." },
    ],
  }),
  component: Travel,
});

function Travel() {
  return (
    <section className="wrap">
      <h1 className="center">Travel & Pilgrimage Help</h1>
      <p className="center muted">Quick phrases for temples, buses and emergencies. Tap 🔊 to let your phone speak.</p>
      <div className="grid3">
        {["Temple & Pilgrimage", "Directions", "Hospital & Emergency"].map((c) => (
          <div key={c} className="card"><h3>{c}</h3>
            {(PHRASES[c] || []).map((p) => (
              <div key={p.en} className="phrase">
                <div><span className="kn">{p.kn}</span><small>{p.en} · {p.pr}</small></div>
                <button className="icon" onClick={() => speak(p.kn, "kn")}>🔊</button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="card band center"><b>Emergency numbers (India):</b> Police 112 · Ambulance 108 · Women's helpline 1091</div>
    </section>
  );
}
