import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listen, offlinePack, speak } from "@/lib/nb";
import { translateFn } from "@/lib/nb.functions";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "More Tools · Namma Baashe" },
      { name: "description", content: "Voice translation, favourite phrases and an offline Kannada phrasebook." },
      { property: "og:title", content: "More Tools · Namma Baashe" },
      { property: "og:description", content: "Voice translation, favourite phrases and an offline Kannada phrasebook." },
    ],
  }),
  component: Tools,
});

function Tools() {
  const [heard, setHeard] = useState("Click and speak");
  const [out, setOut] = useState("");
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => setFavs(JSON.parse(localStorage["nbFavs"] || "[]")), []);

  return (
    <section className="wrap">
      <h1 className="center">More Ways to Use Namma Baashe</h1>
      <div className="grid2">
        <div className="card"><h3>🎙 Voice Translation</h3><p className="muted">Speak in English and hear it in Kannada.</p>
          <button className="mic-big" onClick={() => listen("en", async (t) => {
            setHeard("You said: " + t);
            const r = await translateFn({ data: { text: t, src: "auto", tgt: "kn" } });
            const k = r.result || r.error || "";
            setOut(k);
            if (r.result) speak(k, "kn");
          })}>🎙</button>
          <p className="muted">{heard}</p><p className="result kn">{out}</p>
        </div>
        <div className="card"><h3>💬 Real-Life Conversations</h3>
          <div className="bubble">I need a doctor.</div>
          <div className="bubble kn me">ನನಗೆ ಡಾಕ್ಟರ್ ಬೇಕು. <button className="icon" onClick={() => speak("ನನಗೆ ಡಾಕ್ಟರ್ ಬೇಕು", "kn")}>🔊</button></div>
          <div className="bubble">How much is this?</div>
          <div className="bubble kn me">ಇದು ಎಷ್ಟು? <button className="icon" onClick={() => speak("ಇದು ಎಷ್ಟು?", "kn")}>🔊</button></div>
        </div>
        <div className="card"><h3>♥ Favourite Phrases</h3>
          <ul className="favs">{favs.length ? favs.map((f, i) => <li key={i}>{f}</li>) : <li className="muted">Saved translations appear here.</li>}</ul>
        </div>
        <div className="card"><h3>⤓ Offline Access</h3><p className="muted">Download important phrases and use them without internet.</p>
          <button className="btn" onClick={offlinePack}>Download Offline Pack</button></div>
      </div>
    </section>
  );
}
