import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { eq } from 'drizzle-orm';
import { requireEnv, getDb, getTokenFromRequest, verifyToken } from '../_lib/helpers.js';
import { events, settings, tickets } from '../../src/db/schema.js';

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
};

type SuggestedEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: string;
  imageUrl: string;
};

function getAi() {
  return new GoogleGenAI({ apiKey: requireEnv('GEMINI_API_KEY') });
}

function asText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function formatMoney(value: number | null | undefined, lng: 'vi' | 'en') {
  const amount = Number(value || 0);
  return lng === 'vi'
    ? `${amount.toLocaleString('vi-VN')}đ`
    : `${amount.toLocaleString('en-US')} VND`;
}

function shortText(value: string | null | undefined, max = 180) {
  const text = (value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

function formatEvent(event: typeof events.$inferSelect, lng: 'vi' | 'en') {
  const seatsLeft = Math.max(Number(event.maxAttendees || 0) - Number(event.attendees || 0), 0);
  const audience = (event.forWho || []).join(', ') || 'All';
  const availability = event.status === 'Sold Out'
    ? 'Sold out'
    : `${event.status || 'Available'}${seatsLeft ? `, ${seatsLeft} seats left` : ''}`;

  return [
    `Title: ${event.title}`,
    `Type: ${event.type || 'Workshop'}`,
    `Date/time: ${event.date || 'TBA'} ${event.time || ''}`.trim(),
    `Location: ${event.location || 'TBA'}`,
    `Price: ${formatMoney(event.price, lng)}`,
    `For: ${audience}`,
    `Availability: ${availability}`,
    `Description: ${shortText(event.description) || 'No description yet.'}`,
    `Detail link: /events/${event.id}`,
  ].join(' | ');
}

function formatSettings(rows: Array<typeof settings.$inferSelect>) {
  if (!rows.length) return 'No public settings configured.';
  return rows
    .map((row) => `${row.key}: ${JSON.stringify(row.value)}`)
    .join('\n');
}

function formatHistory(history: ChatMessage[]) {
  if (!history.length) return 'No prior conversation.';
  return history
    .map((item) => `${item.role === 'user' ? 'User' : 'Assistant'}: ${item.text}`)
    .join('\n');
}

function shouldIncludeEventCards(message: string) {
  return /workshop|event|sự kiện|su kien|gợi ý|goi y|hẹn|hen|vé|ve|ticket|nhóm|nhom|group|couple|date|còn vé|con ve|dress|đi/i.test(message);
}

function toSuggestedEvent(event: typeof events.$inferSelect): SuggestedEvent {
  return {
    id: event.id,
    title: event.title,
    type: event.type || 'Workshop',
    date: event.date || '',
    time: event.time || '',
    location: event.location || '',
    price: Number(event.price || 0),
    status: event.status || 'Available',
    imageUrl: event.imageUrl || '',
  };
}

function buildFallbackReply(lng: 'vi' | 'en', liveEvents: Array<typeof events.$inferSelect>) {
  if (!liveEvents.length) {
    return lng === 'vi'
      ? 'Hiện TDL chưa có sự kiện còn vé để gợi ý. Bạn quay lại mục Sự kiện sau ít phút nhé.'
      : 'TDL does not have any bookable events to suggest right now. Please check Events again in a moment.';
  }

  const names = liveEvents
    .slice(0, 3)
    .map((event) => event.title)
    .join(', ');

  return lng === 'vi'
    ? `Mình đang hơi quá tải nên gợi ý nhanh các workshop còn vé cho bạn trước nhé: ${names}. Bạn có thể bấm Đặt vé trên thẻ sự kiện bên dưới để xem chi tiết và chọn số lượng vé.`
    : `I am a little overloaded, so here are quick bookable picks first: ${names}. Use the Book tickets button on each event card to see details and choose your tickets.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const message = asText(req.body?.message);
    const context = asText(req.body?.context, 'TDL event platform assistant');
    const lng: 'vi' | 'en' = req.body?.lng === 'en' ? 'en' : 'vi';
    const history = Array.isArray(req.body?.history)
      ? (req.body.history as ChatMessage[])
        .filter((item) => item && (item.role === 'user' || item.role === 'bot') && typeof item.text === 'string')
        .slice(-8)
      : [];

    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (message.length > 1000) return res.status(400).json({ error: 'Message is too long' });

    const db = getDb();
    const [availableEvents, almostSoldOutEvents, publicSettings] = await Promise.all([
      db.select().from(events).where(eq(events.status, 'Available')),
      db.select().from(events).where(eq(events.status, 'Almost Sold Out')),
      db.select().from(settings),
    ]);

    const liveEvents = [...availableEvents, ...almostSoldOutEvents].slice(0, 12);
    const eventsContext = liveEvents.length
      ? liveEvents.map((event, index) => `${index + 1}. ${formatEvent(event, lng)}`).join('\n')
      : 'No bookable events right now.';

    let userContext = 'User is a guest.';
    const token = getTokenFromRequest(req);
    if (token) {
      try {
        const user = await verifyToken(token);
        const userTickets = await db.select().from(tickets).where(eq(tickets.userId, user.id));
        const ticketSummary = userTickets
          .filter((ticket) => ticket.status !== 'Cancelled')
          .slice(0, 8)
          .map((ticket) => `${ticket.eventTitle} (${ticket.quantity || 1} ticket, ${ticket.eventDate || 'date TBA'}, payment: ${ticket.paymentStatus || 'pending'})`)
          .join('; ');

        userContext = ticketSummary
          ? `Logged-in user: ${user.email}. Tickets: ${ticketSummary}. Dashboard link: /dashboard`
          : `Logged-in user: ${user.email}. No tickets yet. Dashboard link: /dashboard`;
      } catch {
        userContext = 'User sent an invalid or expired token; treat them as a guest.';
      }
    }

    const languageInstruction = lng === 'vi'
      ? 'Respond strictly in natural Vietnamese with correct accents.'
      : 'Respond in natural English.';

    const prompt = `You are TDL Guide, the helpful event concierge for The Date Lab, a creative workshop platform in Vietnam.

${languageInstruction}

Core behavior:
- Help users choose workshops by mood, budget, date/time, group type, location, and activity style.
- Recommend only events listed in the live event data below. If no matching event exists, say so and offer the closest alternatives.
- Use markdown links for event details and dashboard links.
- Keep replies compact: 2-5 short bullets or one short paragraph plus a question.
- If the user asks about booking, payment, tickets, or their own orders, use the user context and point them to [Dashboard](/dashboard) when useful.
- If the user asks for dress code, give practical outfit advice based on the activity and mention stain/comfort considerations.
- If the user asks unrelated questions, gently bring the answer back to TDL events.
- Do not invent discounts, policies, private contact details, or unavailable events.

Live bookable events:
${eventsContext}

Public settings/contact context:
${formatSettings(publicSettings)}

User context:
${userContext}

Recent conversation:
${formatHistory(history)}

Client context: ${context}

Current user message: ${message}`;

    const suggestedEvents = shouldIncludeEventCards(message)
      ? liveEvents.slice(0, 4).map(toSuggestedEvent)
      : [];

    try {
      const response = await getAi().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.55,
          maxOutputTokens: 700,
        },
      });

      const fallback = lng === 'vi'
        ? 'Mình chưa có câu trả lời phù hợp lúc này. Bạn có thể hỏi mình về workshop, giá vé, lịch, dress code hoặc vé của bạn nhé.'
        : 'I do not have a helpful answer right now. You can ask me about workshops, prices, schedules, dress codes, or your tickets.';

      return res.json({ reply: response.text || fallback, suggestedEvents });
    } catch (aiError: any) {
      console.warn('Gemini chatbot generation fell back to event cards:', aiError);
      return res.json({
        reply: buildFallbackReply(lng, liveEvents),
        suggestedEvents,
      });
    }
  } catch (error: any) {
    console.error('Chatbot API Error:', error);
    const message = error?.message || '';
    if (message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({ error: 'Missing API Key' });
    }
    return res.status(500).json({ error: 'Chatbot failed' });
  }
}
