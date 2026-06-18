import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../../_lib/helpers.js';
import { addons } from '../../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  // PUT — Admin: update addon
  if (req.method === 'PUT') {
    const { name, nameEn, price, imageUrl, isActive } = req.body;
    
    const [updated] = await db.update(addons)
      .set({ name, nameEn, price: price !== undefined ? Number(price) : undefined, imageUrl, isActive })
      .where(eq(addons.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Không tìm thấy add-on' });
    return res.json(updated);
  }

  // DELETE — Admin: delete addon
  if (req.method === 'DELETE') {
    await db.delete(addons).where(eq(addons.id, id));
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
