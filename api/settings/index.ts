import type { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { getDb, setCors } from '../_lib/helpers';
import { settings } from '../../src/db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const db = getDb();
    const result = await db.select().from(settings);
    
    // Convert array of {key, value} to a single object
    const settingsObj = result.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);
    
    return res.json(settingsObj);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
