import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq, desc, or, and, inArray } from 'drizzle-orm';
import { getDb, requireAuth, setCors } from '../_lib/helpers.js';
import { vaultMemories, tickets, users } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const db = getDb();

  // GET — vault memories (personal + community)
  if (req.method === 'GET') {
    // 1. Get IDs of events the user has tickets for
    const userTickets = await db.select({ eventId: tickets.eventId })
      .from(tickets)
      .where(eq(tickets.userId, auth.id));
    const userEventIds = userTickets.map(t => t.eventId).filter(id => id !== null);

    // 2. Fetch admin user IDs
    const adminUsersList = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'));
    const adminIds = adminUsersList.map(u => u.id);

    const isAdmin = adminIds.includes(auth.id);

    // 3. Build visibility conditions
    const conditions = [];
    if (!isAdmin) {
      conditions.push(eq(vaultMemories.userId, auth.id)); // My own photos
      
      if (userEventIds.length > 0) {
        // Public photos from events I attended
        conditions.push(and(eq(vaultMemories.isPublic, true), inArray(vaultMemories.eventId, userEventIds)));
      }
      
      if (adminIds.length > 0) {
        // Public photos uploaded by admin
        conditions.push(and(eq(vaultMemories.isPublic, true), inArray(vaultMemories.userId, adminIds)));
      }
    }

    const memories = await db.select({
      id: vaultMemories.id,
      userId: vaultMemories.userId,
      eventId: vaultMemories.eventId,
      eventTitle: vaultMemories.eventTitle,
      imageUrl: vaultMemories.imageUrl,
      caption: vaultMemories.caption,
      isPublic: vaultMemories.isPublic,
      createdAt: vaultMemories.createdAt,
      userName: users.name,
      userRole: users.role,
    })
    .from(vaultMemories)
    .leftJoin(users, eq(vaultMemories.userId, users.id))
    .where(isAdmin ? undefined : or(...conditions))
    .orderBy(desc(vaultMemories.createdAt));

    return res.json(memories);
  }

  // POST — create memory record (after Cloudinary upload)
  if (req.method === 'POST') {
    const { imageUrl, cloudinaryPublicId, eventId, eventTitle, caption, isPublic } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'imageUrl là bắt buộc' });

    const [memory] = await db.insert(vaultMemories).values({
      userId: auth.id,
      imageUrl,
      cloudinaryPublicId: cloudinaryPublicId || '',
      eventId: eventId || null,
      eventTitle: eventTitle || '',
      caption: caption || '',
      isPublic: isPublic !== false, // default true
    }).returning();

    // Fetch user details to return the same format
    const [userRecord] = await db.select({ name: users.name, role: users.role }).from(users).where(eq(users.id, auth.id));
    
    return res.status(201).json({
      ...memory,
      userName: userRecord?.name,
      userRole: userRecord?.role,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
