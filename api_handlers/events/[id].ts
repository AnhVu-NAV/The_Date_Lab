import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../_lib/helpers.js';
import { events } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const db = getDb();

  // GET — public: event detail
  if (req.method === 'GET') {
    const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    if (!event) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    return res.json(event);
  }

  // PUT — admin: update event
  if (req.method === 'PUT') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const {
      title, type, date, time, location, locationType,
      price, maxAttendees, imageUrl, status, forWho, description, schedule, addonIds
    } = req.body;

    const [updated] = await db.update(events)
      .set({
        title, type, date, time, location, locationType,
        price: price !== undefined ? Number(price) : undefined,
        maxAttendees: maxAttendees !== undefined ? Number(maxAttendees) : undefined,
        imageUrl, status, forWho, description, schedule, addonIds,
      })
      .where(eq(events.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    return res.json(updated);
  }

  // DELETE — admin: delete event
  if (req.method === 'DELETE') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    await db.delete(events).where(eq(events.id, id));
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
