import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';
import { getDb, requireAuth, setCors } from '../_lib/helpers.js';
import { vaultMemories, users } from '../../src/db/schema.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAuth(req, res);
  if (!auth) return;

  const db = getDb();
  const memoryId = req.query.id as string;
  if (!memoryId) return res.status(400).json({ error: 'Missing memory ID' });

  // Get current memory and check permissions
  const [memory] = await db.select().from(vaultMemories).where(eq(vaultMemories.id, memoryId));
  if (!memory) return res.status(404).json({ error: 'Memory not found' });

  const [currentUser] = await db.select({ role: users.role }).from(users).where(eq(users.id, auth.id));
  const isAdmin = currentUser?.role === 'admin';

  // Only owner or admin can update/delete
  if (memory.userId !== auth.id && !isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'PUT') {
    const { isPublic } = req.body;
    const [updated] = await db.update(vaultMemories)
      .set({ isPublic: Boolean(isPublic) })
      .where(eq(vaultMemories.id, memoryId))
      .returning();
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    if (memory.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(memory.cloudinaryPublicId);
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err);
      }
    }
    await db.delete(vaultMemories).where(eq(vaultMemories.id, memoryId));
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
