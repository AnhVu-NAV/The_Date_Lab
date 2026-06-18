import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Modality } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post('/api/gemini/quiz', async (req, res) => {
    try {
      const { answers, lng } = req.body;
      const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
      const prompt = `Based on these personality quiz answers: ${JSON.stringify(answers)}, determine the user's event personality type, current mood, and suggest 3 types of events they should attend.
${languageInstruction}
Return a JSON object with properties:
- personalityType (string)
- currentMood (string)
- eventTypes (array of strings)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              personalityType: { type: Type.STRING },
              currentMood: { type: Type.STRING },
              eventTypes: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['personalityType', 'currentMood', 'eventTypes']
          }
        }
      });
      res.json(JSON.parse(response.text || '{}'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process quiz' });
    }
  });

  app.post('/api/gemini/tarot', async (req, res) => {
    try {
      const { cards, lng } = req.body;
      const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
      const prompt = `The user picked these tarot cards: ${cards.join(', ')}. Interpret them in a fun, entertaining way related to attending social events and going out. Suggest what kind of mood they are in and what event they should attend.
${languageInstruction}
Return JSON with properties:
- mood (string)
- advice (string)
- eventType (string)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mood: { type: Type.STRING },
              advice: { type: Type.STRING },
              eventType: { type: Type.STRING }
            },
            required: ['mood', 'advice', 'eventType']
          }
        }
      });
      res.json(JSON.parse(response.text || '{}'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process tarot' });
    }
  });

  app.post('/api/gemini/weather', async (req, res) => {
    try {
      const { location, weatherConditions, lng } = req.body;
      const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
      const prompt = `The current weather in ${location} is ${weatherConditions}. Give a fun, practical suggestion on whether they should attend indoor or outdoor events, what they should wear, and if they need an umbrella/jacket.
${languageInstruction}
Return JSON with properties:
- insideOrOutside (string)
- outfitAdvice (string)
- vibe (string)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
             type: Type.OBJECT,
             properties: {
               insideOrOutside: { type: Type.STRING },
               outfitAdvice: { type: Type.STRING },
               vibe: { type: Type.STRING }
             },
             required: ['insideOrOutside', 'outfitAdvice', 'vibe']
          }
        }
      });
      res.json(JSON.parse(response.text || '{}'));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process weather' });
    }
  });

  app.post('/api/gemini/dresscode', async (req, res) => {
    try {
      const { eventName, eventType, lng } = req.body;
      const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
      const prompt = `Based on an event named "${eventName}" of type "${eventType}", suggest a dresscode suitable for it in a fun, fashionable tone. Include styles like Casual, Smart casual, Cute pastel, Outdoor comfy, Date night, Artsy style, or Minimal chic.
${languageInstruction}
Return JSON with properties:
- style (string)
- outfitSuggestion (string)`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
               style: { type: Type.STRING },
               outfitSuggestion: { type: Type.STRING }
            },
            required: ['style', 'outfitSuggestion']
          }
        }
      });
      res.json(JSON.parse(response.text || '{}'));
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Failed to process dresscode' });
    }
  });

  app.post('/api/gemini/chatbot', async (req, res) => {
    try {
      const { message, context, lng } = req.body;
      const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
      const prompt = `System: You are a friendly, fun, stylish event assistant for a platform similar to Meetup. The user is asking about events. Answer concisely, warmly, and helpfully.
${languageInstruction}
Context about current view: ${context}
User: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      res.json({ reply: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process chatbot logic' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
