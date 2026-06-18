import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../_lib/helpers.js';
import { addons } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  // GET — Public (to show on booking page) or Admin (to manage)
  if (req.method === 'GET') {
    const list = await db.select().from(addons).orderBy(addons.createdAt);
    return res.json(list);
  }

  // POST — Admin only: create addon
  if (req.method === 'POST') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { name, nameEn, price, imageUrl, isActive } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Tên và giá là bắt buộc' });

    const [addon] = await db.insert(addons).values({
      name, nameEn, price: Number(price), imageUrl, isActive
    }).returning();

    return res.status(201).json(addon);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
