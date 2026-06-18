import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAuth, setCors } from '../_lib/helpers.js';
import { users } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const db = getDb();

  // GET — fetch profile
  if (req.method === 'GET') {
    const [user] = await db.select().from(users).where(eq(users.id, auth.id)).limit(1);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { passwordHash: _, ...safeUser } = user;
    return res.json(safeUser);
  }

  // PUT — update profile
  if (req.method === 'PUT') {
    const { name, phone, bio, dob, preferences, notifyEmail, notifySms, avatarUrl, gender, address } = req.body;
    const [updated] = await db.update(users)
      .set({ name, phone, bio, dob, preferences, notifyEmail, notifySms, avatarUrl, gender, address })
      .where(eq(users.id, auth.id))
      .returning();
    const { passwordHash: _, ...safeUser } = updated;
    return res.json(safeUser);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
