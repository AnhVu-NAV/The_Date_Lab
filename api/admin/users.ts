import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, requireAdmin, setCors } from '../_lib/helpers';
import { users } from '../../src/db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  // GET — list all users
  if (req.method === 'GET') {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users);
    return res.json(allUsers);
  }

  // PUT — update user role
  if (req.method === 'PUT') {
    const { userId, role } = req.body;
    if (!userId || !role) return res.status(400).json({ error: 'userId và role là bắt buộc' });
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Role không hợp lệ' });

    const [updated] = await db.update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning({ id: users.id, email: users.email, name: users.name, role: users.role });
    return res.json(updated);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
