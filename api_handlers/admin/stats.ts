import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../_lib/helpers.js';
import { users, events, tickets } from '../../src/db/schema.js';
import { sql, gte, and, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  const [totalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  const [totalEvents] = await db.select({ count: sql<number>`count(*)::int` }).from(events);
  const [totalTickets] = await db.select({ count: sql<number>`count(*)::int` }).from(tickets);
  const [paidTickets] = await db.select({ count: sql<number>`count(*)::int` }).from(tickets)
    .where(eq(tickets.paymentStatus, 'paid'));

  // Revenue from paid tickets
  const [revenue] = await db.select({ total: sql<number>`coalesce(sum(total_price), 0)::int` })
    .from(tickets).where(eq(tickets.paymentStatus, 'paid'));

  // Pending payments
  const [pendingCount] = await db.select({ count: sql<number>`count(*)::int` }).from(tickets)
    .where(eq(tickets.paymentStatus, 'pending'));

  // Revenue Last 7 Days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const revenueQuery = await db.execute(sql`
    SELECT to_char(created_at, 'DD/MM') as name, SUM(total_price) as value
    FROM tickets
    WHERE payment_status = 'paid' AND created_at >= ${sevenDaysAgo}
    GROUP BY to_char(created_at, 'DD/MM'), date(created_at)
    ORDER BY date(created_at) ASC
  `);

  // Tickets by Event Type
  const ticketsByTypeQuery = await db.execute(sql`
    SELECT e.type as name, COUNT(t.id) as sold
    FROM tickets t
    JOIN events e ON t.event_id = e.id
    WHERE t.payment_status = 'paid'
    GROUP BY e.type
  `);

  return res.json({
    totalUsers: totalUsers.count,
    totalEvents: totalEvents.count,
    totalTickets: totalTickets.count,
    paidTickets: paidTickets.count,
    pendingPayments: pendingCount.count,
    totalRevenue: revenue.total,
    revenueData: revenueQuery.rows.map(r => ({ name: r.name, value: Number(r.value) })),
    ticketData: ticketsByTypeQuery.rows.map(r => ({ name: r.name, sold: Number(r.sold) })),
  });
}
