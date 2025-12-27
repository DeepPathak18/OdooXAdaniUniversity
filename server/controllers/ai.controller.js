const { generateAIReply } = require("../services/aiService.js");

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) return res.status(400).json({ error: "Message required" });

    const messages = [...history, { role: "user", content: message }];
    const reply = await generateAIReply(messages);

    res.json({ reply });
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
};

module.exports = { chat };
