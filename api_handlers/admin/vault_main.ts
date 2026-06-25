import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq, desc } from 'drizzle-orm';
import { getDb, requireAuth, setCors } from '../_lib/helpers.js';
import { vaultMemories, users } from '../../src/db/schema.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const db = getDb();

  // Check if user is admin
  const [currentUser] = await db.select({ role: users.role }).from(users).where(eq(users.id, auth.id));
  if (currentUser?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // GET — all vault memories (for admin management)
  if (req.method === 'GET') {
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
    .orderBy(desc(vaultMemories.createdAt));

    return res.json(memories);
  }

  // POST — create memory record as admin
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
      isPublic: isPublic !== false, // admin posts are public by default
    }).returning();

    const [userRecord] = await db.select({ name: users.name, role: users.role }).from(users).where(eq(users.id, auth.id));

    return res.status(201).json({
      ...memory,
      userName: userRecord?.name,
      userRole: userRecord?.role,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
