import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAuth, requireAdmin, setCors } from '../_lib/helpers';
import { tarotCards } from '../../src/db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  // GET — public: all tarot cards
  if (req.method === 'GET') {
    const cards = await db.select().from(tarotCards);
    return res.json(cards);
  }

  // POST — admin: add new card
  if (req.method === 'POST') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const {
      name, nameVi, symbol, colorClass, imageUrl, cloudinaryPublicId,
      messageVi, messageEn, vibeVi, vibeEn,
      eventSuggestionVi, eventSuggestionEn,
      eventDescVi, eventDescEn, eventId,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Tên lá bài là bắt buộc' });

    const [card] = await db.insert(tarotCards).values({
      name, nameVi, symbol: symbol || '✦',
      colorClass: colorClass || 'from-[#243d91] to-[#4ecef5]',
      imageUrl, cloudinaryPublicId,
      messageVi, messageEn, vibeVi, vibeEn,
      eventSuggestionVi, eventSuggestionEn,
      eventDescVi, eventDescEn,
      eventId: eventId || null,
    }).returning();

    return res.status(201).json(card);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
