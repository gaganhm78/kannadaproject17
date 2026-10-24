import phrasesJson from "./phrases.json";

export const LANGUAGES: Record<string, string> = {
  auto: "Auto Detect", kn: "Kannada", en: "English", hi: "Hindi", mr: "Marathi",
  te: "Telugu", ta: "Tamil", ml: "Malayalam", or: "Odia", bn: "Bengali",
  gu: "Gujarati", pa: "Punjabi", ur: "Urdu", sa: "Sanskrit", gom: "Konkani",
  es: "Spanish", fr: "French", de: "German", ar: "Arabic", "zh-CN": "Chinese",
};
export const TARGETS = Object.entries(LANGUAGES).filter(([c]) => c !== "auto");

export type Phrase = { en: string; kn: string; pr: string };
export const PHRASES = phrasesJson as Record<string, Phrase[]>;

const voiceLang = (c: string) =>
  ({ kn: "kn-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", ml: "ml-IN", mr: "mr-IN", en: "en-IN" } as Record<string, string>)[c] || c;

export function speak(text: string, lang: string) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voiceLang(lang);
  speechSynthesis.speak(u);
}

export function listen(lang: string, cb: (t: string) => void) {
  const w = window as any;
  const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Rec) return alert("Voice input isn't supported in this browser. Try Chrome.");
  const r = new Rec();
  r.lang = voiceLang(lang);
  r.onresult = (e: any) => cb(e.results[0][0].transcript);
  r.start();
}

export function downloadText(content: string, name = "namma_baashe.txt") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function offlinePack() {
  const lines = Object.entries(PHRASES).map(
    ([c, ps]) => `[${c}]\n` + ps.map((p) => `${p.en} | ${p.kn} | ${p.pr}`).join("\n"),
  );
  downloadText(lines.join("\n\n"), "namma_baashe_phrasebook.txt");
}
