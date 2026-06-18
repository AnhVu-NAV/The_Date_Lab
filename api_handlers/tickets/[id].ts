import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAuth, requireAdmin, setCors } from '../_lib/helpers.js';
import { tickets } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const db = getDb();

  // GET — auth: ticket detail
  if (req.method === 'GET') {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
    if (!ticket) return res.status(404).json({ error: 'Không tìm thấy vé' });

    // Only owner or admin can view
    if (ticket.userId !== auth.id && auth.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    return res.json(ticket);
  }

  // PUT — admin: update payment status | user: cancel
  if (req.method === 'PUT') {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id)).limit(1);
    if (!ticket) return res.status(404).json({ error: 'Không tìm thấy vé' });

    if (auth.role === 'admin') {
      // Admin can update payment_status and status
      const { paymentStatus, status } = req.body;
      const [updated] = await db.update(tickets)
        .set({ paymentStatus, status })
        .where(eq(tickets.id, id))
        .returning();
      return res.json(updated);
    } else {
      // User can only cancel their own ticket
      if (ticket.userId !== auth.id) return res.status(403).json({ error: 'Không có quyền' });
      const { status } = req.body;
      if (status !== 'Cancelled') return res.status(400).json({ error: 'Chỉ có thể hủy vé' });
      const [updated] = await db.update(tickets)
        .set({ status: 'Cancelled' })
        .where(eq(tickets.id, id))
        .returning();
      return res.json(updated);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
