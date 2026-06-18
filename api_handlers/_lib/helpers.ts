import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../src/db/schema';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tdl-super-secret-32-chars-minimum!!'
);

// DB client (server-side only)
export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDb() {
  const sql = neon(requireEnv('DATABASE_URL'));
  return drizzle(sql, { schema });
}

// JWT utilities
export async function signToken(payload: { id: string; email: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as { id: string; email: string; role: string };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Middleware helpers
export function getTokenFromRequest(req: VercelRequest): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export async function requireAuth(req: VercelRequest, res: VercelResponse) {
  const token = getTokenFromRequest(req);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  try {
    return await verifyToken(token);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return null;
  }
}

export async function requireAdmin(req: VercelRequest, res: VercelResponse) {
  const user = await requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return null;
  }
  return user;
}

// CORS helper
export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Generate payment reference
export function generatePaymentRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'TDL';
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}
