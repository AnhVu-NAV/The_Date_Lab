import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../_lib/helpers.js';
import { settings } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'PUT') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const db = getDb();
    const body = req.body || {};
    
    // For each key in the body, update or insert into the settings table
    for (const [key, value] of Object.entries(body)) {
      const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
      if (existing.length > 0) {
        await db.update(settings).set({ value }).where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({ key, value });
      }
    }
    
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
