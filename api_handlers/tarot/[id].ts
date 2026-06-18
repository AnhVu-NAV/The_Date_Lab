import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../_lib/helpers.js';
import { tarotCards } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  if (req.method === 'PUT') {
    const {
      name, nameVi, symbol, colorClass, imageUrl, cloudinaryPublicId,
      messageVi, messageEn, vibeVi, vibeEn,
      eventSuggestionVi, eventSuggestionEn,
      eventDescVi, eventDescEn, eventId,
    } = req.body;

    const [updated] = await db.update(tarotCards)
      .set({
        name, nameVi, symbol, colorClass, imageUrl, cloudinaryPublicId,
        messageVi, messageEn, vibeVi, vibeEn,
        eventSuggestionVi, eventSuggestionEn,
        eventDescVi, eventDescEn, eventId: eventId || null,
      })
      .where(eq(tarotCards.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Không tìm thấy lá bài' });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    await db.delete(tarotCards).where(eq(tarotCards.id, id));
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
