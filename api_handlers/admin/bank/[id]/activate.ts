import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../../../_lib/helpers.js';
import { bankAccounts } from '../../../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  // Deactivate all, then activate the selected one
  await db.update(bankAccounts).set({ isActive: false });
  const [activated] = await db.update(bankAccounts)
    .set({ isActive: true })
    .where(eq(bankAccounts.id, id))
    .returning();

  if (!activated) return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
  return res.json({ success: true, bank: activated });
}
