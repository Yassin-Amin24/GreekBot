require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function detect_openAI(history) {

  const alert = {
    role: "system",
    content: "Remember if the user's message is not related to greek mythology, please add the keyword *FALLBACK* to the start of the response!"
  };

  const prompt = [alert, ...history];

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: prompt, 
    max_tokens: 1000,
  });


  return res.choices[0].message.content;
}

module.exports = detect_openAI;
