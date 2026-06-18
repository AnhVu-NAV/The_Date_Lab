import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { requireEnv, getDb, getTokenFromRequest, verifyToken } from '../_lib/helpers.js';
import { events, tickets } from '../../src/db/schema.js';
import { eq } from 'drizzle-orm';

function getAi() {
  return new GoogleGenAI({ apiKey: requireEnv('GEMINI_API_KEY') });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { message, context, lng } = req.body;
    const db = getDb();
    
    // Fetch active events from DB
    const activeEvents = await db.select().from(events).where(eq(events.status, 'Available'));
    const eventsContext = activeEvents.map(e => 
      `- ${e.title} (${e.date} ${e.time}) at ${e.location}. Price: ${e.price} VND. Link: [Xem chi tiết](/events/${e.id})`
    ).join('\n');

    // Fetch user context if logged in
    let userContext = 'User is a guest.';
    const token = getTokenFromRequest(req);
    if (token) {
      try {
        const user = await verifyToken(token);
        const userTickets = await db.select().from(tickets).where(eq(tickets.userId, user.id));
        if (userTickets.length > 0) {
          userContext = `User (${user.email}) has purchased tickets for: ` + 
            userTickets.map(t => `${t.eventTitle} (${t.quantity} vé)`).join(', ') +
            '. Link to their tickets: [Vé của tôi](/dashboard)';
        } else {
          userContext = `User (${user.email}) has not purchased any tickets yet.`;
        }
      } catch (e) {
        // Ignore token errors
      }
    }

    const languageInstruction = lng === 'vi' ? 'Respond strictly in Vietnamese.' : 'Respond in English.';
    
    const prompt = `System: You are a friendly, fun, stylish event assistant for The Date Lab — a creative workshop platform in Hanoi, Vietnam. Answer concisely, warmly, and helpfully.
Use markdown links when suggesting events or directing users to their dashboard.

${languageInstruction}

Current Active Events at TDL:
${eventsContext || 'No active events right now.'}

User Context:
${userContext}

Additional Context: ${context}
User: ${message}`;

    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chatbot API Error:', error);
    const msg = error.message || '';
    if (msg.includes('GEMINI_API_KEY')) {
      res.status(500).json({ error: 'Missing API Key' });
    } else {
      res.status(500).json({ error: 'Chatbot failed' });
    }
  }
}
