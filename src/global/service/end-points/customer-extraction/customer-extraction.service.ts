import { ENV } from "@/config";

export async function extractCustomerFromGemini(payload: unknown) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${ENV.VITE_GEMINI_MODEL}:generateContent?key=${ENV.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "omit",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Gemini extraction failed");
  }

  return res.json();
}
