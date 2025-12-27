const axios = require("axios");

const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

async function generateAIReply(messages) {
  const contents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const payload = { contents, generationConfig: { temperature: 0.7 } };

  const { data } = await axios.post(url, payload, {
    headers: { "Content-Type": "application/json" },
  });

  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response";
}

module.exports = { generateAIReply };