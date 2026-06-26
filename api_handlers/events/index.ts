import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq, like, and, sql } from 'drizzle-orm';
import { getDb, requireAdmin, setCors, getTokenFromRequest, verifyToken } from '../_lib/helpers.js';
import { events } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  // GET — public: list events with optional filters
  if (req.method === 'GET') {
    const { search, status, type, forWho } = req.query;
    let query = db.select().from(events);

    const rows = await db.select().from(events);
    let filtered = rows;

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.type || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q)
      );
    }
    if (status) filtered = filtered.filter(e => e.status === status);
    if (type) filtered = filtered.filter(e => e.type === type);
    if (forWho) filtered = filtered.filter(e => (e.forWho || []).includes(String(forWho)));

    return res.json(filtered);
  }

  // POST — admin only: create event
  if (req.method === 'POST') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const {
      title, type, date, time, location, locationType,
      price, maxAttendees, imageUrl, status, forWho, description, schedule, addonIds,
      comboMinTickets, comboDiscountPercent
    } = req.body;

    if (!title) return res.status(400).json({ error: 'Tên sự kiện là bắt buộc' });

    const [event] = await db.insert(events).values({
      title, type, date, time, location, locationType,
      price: Number(price) || 0,
      maxAttendees: Number(maxAttendees) || 20,
      imageUrl, status: status || 'Available',
      forWho: forWho || [],
      description, schedule: schedule || [],
      addonIds: addonIds || [],
      comboMinTickets: Number(comboMinTickets) || 0,
      comboDiscountPercent: Number(comboDiscountPercent) || 0,
    }).returning();

    return res.status(201).json(event);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
