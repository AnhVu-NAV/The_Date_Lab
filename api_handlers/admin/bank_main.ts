import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../_lib/helpers.js';
import { bankAccounts } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  // GET — list all bank accounts
  if (req.method === 'GET') {
    const banks = await db.select().from(bankAccounts);
    return res.json(banks);
  }

  // POST — add new bank account
  if (req.method === 'POST') {
    const { bankName, bankCode, accountNumber, accountName, isActive } = req.body;
    if (!bankName || !bankCode || !accountNumber || !accountName) {
      return res.status(400).json({ error: 'Thông tin ngân hàng chưa đầy đủ' });
    }

    // If setting as active, deactivate others
    if (isActive) {
      await db.update(bankAccounts).set({ isActive: false });
    }

    const [bank] = await db.insert(bankAccounts).values({
      bankName, bankCode, accountNumber, accountName,
      isActive: isActive || false,
    }).returning();

    return res.status(201).json(bank);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
