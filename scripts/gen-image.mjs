// Generator imagini cu Gemini (Nano Banana). Cheia se ia din env GEMINI_KEY.
// Usage: node scripts/gen-image.mjs "<prompt>" public/images/generated/out.png
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const key = process.env.GEMINI_KEY;
const prompt = process.argv[2];
const out = process.argv[3] ?? "public/images/generated/out.png";
if (!key) { console.error("Missing GEMINI_KEY"); process.exit(1); }

const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-image";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const body = {
  contents: [{ parts: [{ text: prompt }] }],
};

const headers = { "Content-Type": "application/json", "x-goog-api-key": key };

const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
const status = res.status;
const json = await res.json().catch(() => ({}));

if (status !== 200) {
  console.error("HTTP", status);
  console.error(JSON.stringify(json).slice(0, 600));
  process.exit(2);
}

const parts = json?.candidates?.[0]?.content?.parts ?? [];
const img = parts.find((p) => p.inlineData?.data);
if (!img) {
  console.error("No image in response:", JSON.stringify(json).slice(0, 600));
  process.exit(3);
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
console.log("OK", out, "bytes:", Buffer.from(img.inlineData.data, "base64").length);
