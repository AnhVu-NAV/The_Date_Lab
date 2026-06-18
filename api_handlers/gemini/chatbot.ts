import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { requireEnv } from '../_lib/helpers';

function getAi() {
  return new GoogleGenAI({ apiKey: requireEnv('GEMINI_API_KEY') });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { message, context, lng } = req.body;
    const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
    const prompt = `System: You are a friendly, fun, stylish event assistant for The Date Lab — a creative workshop platform in Hanoi, Vietnam. Answer concisely, warmly, and helpfully.
${languageInstruction}
Context: ${context}
User: ${message}`;

    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    res.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Chatbot failed', reply: 'Xin lỗi, mình đang bận một chút. Thử lại sau nhé! 💕' });
  }
}
