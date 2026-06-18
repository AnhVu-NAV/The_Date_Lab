import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../../_lib/helpers.js';
import { bankAccounts } from '../../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  // PUT — update bank account
  if (req.method === 'PUT') {
    const { bankName, bankCode, accountNumber, accountName, isActive } = req.body;
    const [updated] = await db.update(bankAccounts)
      .set({ bankName, bankCode, accountNumber, accountName, isActive })
      .where(eq(bankAccounts.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
    return res.json(updated);
  }

  // DELETE — delete bank account
  if (req.method === 'DELETE') {
    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
