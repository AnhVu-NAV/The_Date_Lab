import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';
import { getDb, requireAuth, setCors } from '../../_lib/helpers.js';
import { vaultMemories, users } from '../../../src/db/schema.js';

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

  // Check admin
  const [currentUser] = await db.select({ role: users.role }).from(users).where(eq(users.id, auth.id));
  if (currentUser?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  // DELETE — delete any vault memory
  if (req.method === 'DELETE') {
    const [memory] = await db.select().from(vaultMemories).where(eq(vaultMemories.id, id));
    if (memory?.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(memory.cloudinaryPublicId);
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err);
      }
    }
    await db.delete(vaultMemories).where(eq(vaultMemories.id, id));
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
