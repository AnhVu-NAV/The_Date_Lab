import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  const events = await db.select().from(schema.events);
  if (events.length === 0) return;

  const tarotCards = await db.select().from(schema.tarotCards);
  
  for (const card of tarotCards) {
    // Try to match by type if possible. The seed suggests:
    // Star: Nến, Moon: Nước hoa, Sun: Baking, World: Gốm, Lovers: Nước hoa, Hermit: Gốm
    let matchedEvent = events[0];
    if (card.name === 'The Star') matchedEvent = events.find(e => e.type === 'Nến') || events[0];
    if (card.name === 'The Moon' || card.name === 'The Lovers') matchedEvent = events.find(e => e.type === 'Nước hoa') || events[0];
    if (card.name === 'The Sun') matchedEvent = events.find(e => e.type === 'Baking') || events[0];
    if (card.name === 'The World' || card.name === 'The Hermit') matchedEvent = events.find(e => e.type === 'Gốm') || events[0];

    await db.update(schema.tarotCards)
      .set({ eventId: matchedEvent.id })
      .where(eq(schema.tarotCards.id, card.id));
  }
  console.log('Fixed tarot cards eventIds');
}

main();
