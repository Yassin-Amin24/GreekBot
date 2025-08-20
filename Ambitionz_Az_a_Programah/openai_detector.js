require("dotenv").config();
const OpenAI = require("openai");

let openai;

// Initialize OpenAI client only when needed
function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

async function detect_openAI(history) {

  const alert = {
    role: "system",
    content: "Remember if the user's message is not related to greek mythology, please add the keyword *FALLBACK* to the start of the response!"
  };

  const prompt = [alert, ...history];

  const openaiClient = getOpenAIClient();
  const res = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: prompt, 
    max_tokens: 1000,
  });


  return res.choices[0].message.content;
}

module.exports = detect_openAI;
