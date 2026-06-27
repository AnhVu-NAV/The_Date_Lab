import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq, desc } from 'drizzle-orm';
import { getDb, requireAuth, requireAdmin, setCors, generatePaymentRef } from '../_lib/helpers.js';
import { tickets, events, addons } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDb();

  // GET — auth user: my tickets | admin: all tickets
  if (req.method === 'GET') {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    if (auth.role === 'admin') {
      // Admin sees all tickets with payment status
      const allTickets = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
      return res.json(allTickets);
    } else {
      const myTickets = await db.select().from(tickets)
        .where(eq(tickets.userId, auth.id))
        .orderBy(desc(tickets.createdAt));
      return res.json(myTickets);
    }
  }

  // POST — auth: book ticket
  if (req.method === 'POST') {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    const { eventId, quantity, addons: addonList, totalPrice } = req.body;
    if (!eventId || !quantity) {
      return res.status(400).json({ error: 'eventId và quantity là bắt buộc' });
    }

    // Get event info
    const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!event) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    if (event.status === 'Sold Out') return res.status(400).json({ error: 'Sự kiện đã hết vé' });

    const currentAttendees = event.attendees || 0;
    const maxAttendees = event.maxAttendees || 20;
    const qtyNum = Number(quantity);

    if (currentAttendees + qtyNum > maxAttendees) {
      return res.status(400).json({ error: `Chỉ còn ${maxAttendees - currentAttendees} chỗ trống` });
    }

    // Securely calculate total price
    let calculatedTotalPrice = (event.price || 0) * qtyNum;
    
    // Apply combo discounts
    const comboDiscounts = Array.isArray(event.comboDiscounts) ? event.comboDiscounts : [];
    let applicableDiscountPercent = 0;
    
    if (comboDiscounts.length > 0) {
      const sortedDescDiscounts = [...comboDiscounts].sort((a: any, b: any) => b.minTickets - a.minTickets);
      for (const tier of sortedDescDiscounts) {
        if (qtyNum >= tier.minTickets) {
          applicableDiscountPercent = Math.round(tier.discountPercent);
          break;
        }
      }
    } else if ((event.comboMinTickets || 0) > 0 && (event.comboDiscountPercent || 0) > 0) {
      if (qtyNum >= (event.comboMinTickets || 0)) {
        applicableDiscountPercent = Math.round(event.comboDiscountPercent || 0);
      }
    }
    
    const discountAmount = applicableDiscountPercent > 0 ? Math.round(calculatedTotalPrice * (applicableDiscountPercent / 100)) : 0;
    calculatedTotalPrice -= discountAmount;

    // Verify addons and add their cost
    const allDbAddons = await db.select().from(addons).where(eq(addons.isActive, true));
    const verifiedAddons = [];
    if (Array.isArray(addonList)) {
      for (const clientAddon of addonList) {
        const dbAddon = allDbAddons.find(a => a.name === clientAddon.name || a.nameEn === clientAddon.name);
        if (dbAddon) {
          calculatedTotalPrice += dbAddon.price || 0;
          // Use client's name (vi or en) but trust db price
          verifiedAddons.push({ name: clientAddon.name, price: dbAddon.price });
        }
      }
    }

    const paymentRef = generatePaymentRef();

    const [ticket] = await db.insert(tickets).values({
      userId: auth.id,
      eventId,
      eventTitle: event.title,
      eventDate: event.date || '',
      eventTime: event.time || '',
      eventLocation: event.location || '',
      eventImageUrl: event.imageUrl || '',
      quantity: qtyNum,
      addons: verifiedAddons,
      totalPrice: calculatedTotalPrice,
      status: 'Upcoming',
      paymentStatus: 'pending',
      paymentRef,
    }).returning();

    // Update attendees count and check if sold out
    const newAttendees = currentAttendees + qtyNum;
    let newStatus = event.status;
    if (newAttendees >= maxAttendees) {
      newStatus = 'Sold Out';
    } else if (newAttendees >= maxAttendees * 0.8) {
      newStatus = 'Almost Sold Out';
    }

    await db.update(events)
      .set({ attendees: newAttendees, status: newStatus })
      .where(eq(events.id, eventId));

    return res.status(201).json({ ...ticket, paymentRef });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
