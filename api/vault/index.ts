import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq, desc } from 'drizzle-orm';
import { getDb, requireAuth, setCors } from '../_lib/helpers';
import { vaultMemories } from '../../src/db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const db = getDb();

  // GET — my vault memories
  if (req.method === 'GET') {
    const memories = await db.select().from(vaultMemories)
      .where(eq(vaultMemories.userId, auth.id))
      .orderBy(desc(vaultMemories.createdAt));
    return res.json(memories);
  }

  // POST — create memory record (after Cloudinary upload)
  if (req.method === 'POST') {
    const { imageUrl, cloudinaryPublicId, eventId, eventTitle, caption } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl là bắt buộc' });

    const [memory] = await db.insert(vaultMemories).values({
      userId: auth.id,
      imageUrl,
      cloudinaryPublicId: cloudinaryPublicId || '',
      eventId: eventId || null,
      eventTitle: eventTitle || '',
      caption: caption || '',
    }).returning();

    return res.status(201).json(memory);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
