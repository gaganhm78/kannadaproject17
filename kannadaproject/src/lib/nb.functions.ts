import { createServerFn } from "@tanstack/react-start";

export const translateFn = createServerFn({ method: "POST" })
  .validator((d: { text: string; src: string; tgt: string }) => d)
  .handler(async ({ data }) => {
    const text = (data.text || "").slice(0, 5000);
    if (!text.trim()) return { error: "Please enter some text to translate." };
    if (data.src === data.tgt && data.src !== "auto") return { result: text, detected: data.src };
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(data.src)}&tl=${encodeURIComponent(data.tgt)}&dt=t&q=${encodeURIComponent(text)}`;
    try {
      const r = await fetch(url);
      if (!r.ok) return { error: `Translation failed (${r.status}).` };
      const j: any = await r.json();
      const result = (j[0] as any[]).map((s) => s[0]).join("");
      return { result, detected: j[2] as string };
    } catch (e) {
      return { error: "Translation failed. Please try again." };
    }
  });

export const simplifyFn = createServerFn({ method: "POST" })
  .validator((d: { text: string }) => d)
  .handler(async ({ data }) => {
    if (!data.text.trim()) return { error: "Please paste some Kannada text." };
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        instructions:
          "Rewrite the given Kannada text into simple everyday spoken Kannada that anyone can understand. Keep the meaning. Then on a new line starting with 'English:' give a short plain English meaning.",
        input: data.text.slice(0, 5000),
      });
      const text = res.output
        .flatMap((o) => (o.type === "message" ? o.content : []))
        .map((c) => (c.type === "output_text" ? c.text : ""))
        .join("");
      return { result: text };
    } catch (e) {
      if (e instanceof GatewayError) {
        if (e.httpStatus === 429) return { error: "Too many requests. Please wait a moment." };
        if (e.httpStatus === 402) return { error: "AI credits are used up. Please add credits." };
      }
      return { error: "Simplify failed. Please try again." };
    }
  });
