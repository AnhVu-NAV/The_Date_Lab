import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';
import { requireEnv } from '../_lib/helpers';

function getAi() {
  return new GoogleGenAI({ apiKey: requireEnv('GEMINI_API_KEY') });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { answers, lng } = req.body;
    const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
    const prompt = `Based on these personality quiz answers: ${JSON.stringify(answers)}, suggest 3 types of creative workshop events they should attend at The Date Lab.
${languageInstruction}
Return a JSON object with: personalityType (string), currentMood (string), eventTypes (array of strings).`;

    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalityType: { type: Type.STRING },
            currentMood: { type: Type.STRING },
            eventTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['personalityType', 'currentMood', 'eventTypes'],
        },
      },
    });
    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Quiz failed' });
  }
}
