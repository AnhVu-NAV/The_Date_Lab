import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, setCors } from '../_lib/helpers.js';
import { bankAccounts } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, description, ticketId } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const db = getDb();

    // Get active bank account from DB
    const [bank] = await db.select().from(bankAccounts)
      .where(eq(bankAccounts.isActive, true))
      .limit(1);

    if (!bank) {
      return res.status(503).json({ error: 'Chưa có tài khoản ngân hàng được thiết lập' });
    }

    const ref = ticketId || description || 'TDLPAYMENT';
    const addInfo = encodeURIComponent(String(ref));
    const accountName = encodeURIComponent(bank.accountName);

    // VietQR URL — generates QR image directly
    const qrUrl = `https://img.vietqr.io/image/${bank.bankCode}-${bank.accountNumber}-qr_only.jpg` +
      `?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;

    // Also return a compact URL for mobile banking apps
    const deepLink = `https://img.vietqr.io/image/${bank.bankCode}-${bank.accountNumber}-compact.jpg` +
      `?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;

    return res.json({
      qrUrl,
      deepLink,
      bank: {
        bankName: bank.bankName,
        bankCode: bank.bankCode,
        accountNumber: bank.accountNumber,
        accountName: bank.accountName,
      },
      amount: Number(amount),
      ref: String(ref),
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return res.status(500).json({ error: 'Không thể tạo mã QR' });
  }
}
