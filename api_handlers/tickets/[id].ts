import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAuth, requireAdmin, setCors } from '../_lib/helpers.js';
import { tickets, events } from '../../src/db/schema.js';

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
        
      if (status === 'Cancelled' && ticket.status !== 'Cancelled' && ticket.eventId) {
        const [event] = await db.select().from(events).where(eq(events.id, ticket.eventId)).limit(1);
        if (event) {
          const newAttendees = Math.max(0, (event.attendees || 0) - (ticket.quantity || 0));
          let newStatus = event.status;
          if (newAttendees < (event.maxAttendees || 20)) {
            newStatus = newAttendees >= (event.maxAttendees || 20) * 0.8 ? 'Almost Sold Out' : 'Available';
          }
          await db.update(events).set({ attendees: newAttendees, status: newStatus }).where(eq(events.id, event.id));
        }
      } else if (status !== 'Cancelled' && ticket.status === 'Cancelled' && ticket.eventId) {
        const [event] = await db.select().from(events).where(eq(events.id, ticket.eventId)).limit(1);
        if (event) {
          const newAttendees = (event.attendees || 0) + (ticket.quantity || 0);
          let newStatus = event.status;
          if (newAttendees >= (event.maxAttendees || 20)) {
            newStatus = 'Sold Out';
          } else if (newAttendees >= (event.maxAttendees || 20) * 0.8) {
            newStatus = 'Almost Sold Out';
          }
          await db.update(events).set({ attendees: newAttendees, status: newStatus }).where(eq(events.id, event.id));
        }
      }
      
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

      if (ticket.status !== 'Cancelled' && ticket.eventId) {
        const [event] = await db.select().from(events).where(eq(events.id, ticket.eventId)).limit(1);
        if (event) {
          const newAttendees = Math.max(0, (event.attendees || 0) - (ticket.quantity || 0));
          let newStatus = event.status;
          if (newAttendees < (event.maxAttendees || 20)) {
            newStatus = newAttendees >= (event.maxAttendees || 20) * 0.8 ? 'Almost Sold Out' : 'Available';
          }
          await db.update(events).set({ attendees: newAttendees, status: newStatus }).where(eq(events.id, event.id));
        }
      }

      return res.json(updated);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
