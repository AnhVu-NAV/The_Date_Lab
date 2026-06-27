import { pgTable, text, integer, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  phone: text('phone').default(''),
  bio: text('bio').default(''),
  dob: text('dob').default(''),
  role: text('role').default('user').notNull(), // 'user' | 'admin'
  avatarUrl: text('avatar_url').default(''),
  gender: text('gender').default(''), // 'male' | 'female' | 'other' | ''
  address: text('address').default(''),
  preferences: text('preferences').array().default([]),
  notifyEmail: boolean('notify_email').default(true),
  notifySms: boolean('notify_sms').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Events ──────────────────────────────────────────────────────────────────
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  type: text('type').default(''),
  date: text('date').default(''),
  time: text('time').default(''),
  location: text('location').default(''),
  locationType: text('location_type').default('Fixed'),
  price: integer('price').default(0),
  maxAttendees: integer('max_attendees').default(20),
  attendees: integer('attendees').default(0),
  imageUrl: text('image_url').default(''),
  status: text('status').default('Available'), // Available | Almost Sold Out | Sold Out
  forWho: text('for_who').array().default([]),
  description: text('description').default(''),
  schedule: jsonb('schedule').default([]),
  addonIds: text('addon_ids').array().default([]),
  comboMinTickets: integer('combo_min_tickets').default(0),
  comboDiscountPercent: integer('combo_discount_percent').default(0),
  comboDiscounts: jsonb('combo_discounts').default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Tarot Cards (Admin managed) ─────────────────────────────────────────────
export const tarotCards = pgTable('tarot_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameVi: text('name_vi').default(''),
  symbol: text('symbol').default('✦'),
  colorClass: text('color_class').default('from-[#243d91] to-[#4ecef5]'),
  imageUrl: text('image_url').default(''),
  cloudinaryPublicId: text('cloudinary_public_id').default(''),
  messageVi: text('message_vi').default(''),
  messageEn: text('message_en').default(''),
  vibeVi: text('vibe_vi').default(''),
  vibeEn: text('vibe_en').default(''),
  eventSuggestionVi: text('event_suggestion_vi').default(''),
  eventSuggestionEn: text('event_suggestion_en').default(''),
  eventDescVi: text('event_desc_vi').default(''),
  eventDescEn: text('event_desc_en').default(''),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Tickets ─────────────────────────────────────────────────────────────────
export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
  eventTitle: text('event_title').default(''),
  eventDate: text('event_date').default(''),
  eventTime: text('event_time').default(''),
  eventLocation: text('event_location').default(''),
  eventImageUrl: text('event_image_url').default(''),
  quantity: integer('quantity').default(1),
  addons: jsonb('addons').default([]),
  totalPrice: integer('total_price').default(0),
  status: text('status').default('Upcoming'), // Upcoming | Past | Cancelled
  cancelReason: text('cancel_reason').default(''),
  paymentStatus: text('payment_status').default('pending'), // pending | paid | failed
  paymentRef: text('payment_ref').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Vault Memories ───────────────────────────────────────────────────────────
export const vaultMemories = pgTable('vault_memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
  eventTitle: text('event_title').default(''),
  imageUrl: text('image_url').notNull(),
  cloudinaryPublicId: text('cloudinary_public_id').default(''),
  caption: text('caption').default(''),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Bank Accounts (Admin managed, used for VietQR) ──────────────────────────
export const bankAccounts = pgTable('bank_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  bankName: text('bank_name').notNull(),
  bankCode: text('bank_code').notNull(), // MB, VCB, TCB, etc.
  accountNumber: text('account_number').notNull(),
  accountName: text('account_name').notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Add-ons (Admin managed) ─────────────────────────────────────────────────
export const addons = pgTable('addons', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  nameEn: text('name_en').default(''),
  price: integer('price').default(0),
  imageUrl: text('image_url').default(''),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// ─── Settings (Admin managed) ────────────────────────────────────────────────
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(), // e.g. 'contact_info'
  value: jsonb('value').default({}), // stores phone, email, address, etc.
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Types ───────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type TarotCard = typeof tarotCards.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type VaultMemory = typeof vaultMemories.$inferSelect;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type Addon = typeof addons.$inferSelect;
export type Setting = typeof settings.$inferSelect;
