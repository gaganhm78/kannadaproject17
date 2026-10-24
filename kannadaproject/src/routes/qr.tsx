import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { TARGETS } from "@/lib/nb";
import { translateFn } from "@/lib/nb.functions";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Scanner · Namma Baashe" },
      { name: "description", content: "Scan a QR code with your camera and translate its text." },
      { property: "og:title", content: "QR Scanner · Namma Baashe" },
      { property: "og:description", content: "Scan a QR code with your camera and translate its text." },
    ],
  }),
  component: Qr,
});

function Qr() {
  const video = useRef<HTMLVideoElement>(null);
  const [tgt, setTgt] = useState("kn");
  const [msg, setMsg] = useState("Uses your browser's built-in QR reader (Chrome / Edge / Android).");
  const [raw, setRaw] = useState("");
  const [out, setOut] = useState("");

  async function start() {
    const w = window as any;
    if (!("BarcodeDetector" in w)) return setMsg("QR reading isn't supported in this browser. Try Chrome on Android or desktop.");
    const v = video.current!;
    const det = new w.BarcodeDetector({ formats: ["qr_code"] });
    try {
      v.srcObject = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    } catch {
      return setMsg("Camera permission was denied.");
    }
    await v.play();
    setMsg("Scanning…");
    const loop = async () => {
      const c = await det.detect(v);
      if (c.length) {
        const r = c[0].rawValue as string;
        setRaw(r);
        (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        setMsg("Found a QR code.");
        const t = await translateFn({ data: { text: r, src: "auto", tgt } });
        setOut(t.result || t.error || "");
      } else requestAnimationFrame(loop);
    };
    loop();
  }

  return (
    <section className="wrap narrow">
      <h1 className="center">QR Scanner</h1>
      <p className="center muted">Point your camera at a QR code. Its text is translated automatically.</p>
      <div className="panel center">
        <video ref={video} id="qr-video" playsInline muted />
        <div className="row center-row">
          <button className="btn" onClick={start}>📷 Start camera</button>
          <select value={tgt} onChange={(e) => setTgt(e.target.value)}>
            {TARGETS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}
          </select>
        </div>
        <p className="muted">{msg}</p>
      </div>
      <div className="two">
        <div className="box"><small className="label">QR content</small><p>{raw}</p></div>
        <div className="box out"><small className="label">Translation</small><p className="result">{out}</p></div>
      </div>
    </section>
  );
}
