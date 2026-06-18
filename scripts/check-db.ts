import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  const tarotCards = await db.select().from(schema.tarotCards);
  console.log('Tarot cards:', tarotCards.map(c => ({ id: c.id, eventId: c.eventId, name: c.name })));

  const events = await db.select().from(schema.events);
  console.log('Events:', events.map(e => ({ id: e.id, title: e.title })));
}

main();
