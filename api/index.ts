import type { VercelRequest, VercelResponse } from '@vercel/node';

// Admin
import adminAddons from '../api_handlers/admin/addons.ts';
import adminAddonsId from '../api_handlers/admin/addons/[id].ts';
import adminBank from '../api_handlers/admin/bank.ts';
import adminBankId from '../api_handlers/admin/bank/[id].ts';
import adminBankIdActivate from '../api_handlers/admin/bank/[id]/activate.ts';
import adminSettings from '../api_handlers/admin/settings.ts';
import adminStats from '../api_handlers/admin/stats.ts';
import adminUsers from '../api_handlers/admin/users.ts';

// Auth
import authLogin from '../api_handlers/auth/login.ts';
import authMe from '../api_handlers/auth/me.ts';
import authRegister from '../api_handlers/auth/register.ts';

// Events
import eventsIndex from '../api_handlers/events/index.ts';
import eventsId from '../api_handlers/events/[id].ts';

// Gemini
import geminiChatbot from '../api_handlers/gemini/chatbot.ts';
import geminiQuiz from '../api_handlers/gemini/quiz.ts';

// Payment
import paymentQr from '../api_handlers/payment/qr.ts';

// Settings
import settingsIndex from '../api_handlers/settings/index.ts';

// Tarot
import tarotIndex from '../api_handlers/tarot/index.ts';
import tarotId from '../api_handlers/tarot/[id].ts';

// Tickets
import ticketsIndex from '../api_handlers/tickets/index.ts';
import ticketsId from '../api_handlers/tickets/[id].ts';

// Vault
import vaultIndex from '../api_handlers/vault/index.ts';
import vaultUpload from '../api_handlers/vault/upload.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize req.query if undefined
    if (!req.query) req.query = {};

    // Use the route parameter injected by Vercel rewrite
    const routePath = (req.query.route as string) || '';
    const segments = routePath.split('/').filter(Boolean);

    const seg0 = segments[0];
    const seg1 = segments[1];
    const seg2 = segments[2];
    const seg3 = segments[3];

    if (seg0 === 'admin') {
      if (seg1 === 'addons') {
        if (segments.length === 2) return adminAddons(req, res);
        if (segments.length === 3) {
          req.query.id = seg2;
          return adminAddonsId(req, res);
        }
      }
      if (seg1 === 'bank') {
        if (segments.length === 2) return adminBank(req, res);
        if (segments.length === 3) {
          req.query.id = seg2;
          return adminBankId(req, res);
        }
        if (segments.length === 4 && seg3 === 'activate') {
          req.query.id = seg2;
          return adminBankIdActivate(req, res);
        }
      }
      if (seg1 === 'settings') return adminSettings(req, res);
      if (seg1 === 'stats') return adminStats(req, res);
      if (seg1 === 'users') return adminUsers(req, res);
    }

    if (seg0 === 'auth') {
      if (seg1 === 'login') return authLogin(req, res);
      if (seg1 === 'me') return authMe(req, res);
      if (seg1 === 'register') return authRegister(req, res);
    }

    if (seg0 === 'events') {
      if (segments.length === 1) return eventsIndex(req, res);
      if (segments.length === 2) {
        req.query.id = seg1;
        return eventsId(req, res);
      }
    }

    if (seg0 === 'gemini') {
      if (seg1 === 'chatbot') return geminiChatbot(req, res);
      if (seg1 === 'quiz') return geminiQuiz(req, res);
    }

    if (seg0 === 'payment' && seg1 === 'qr') {
      return paymentQr(req, res);
    }

    if (seg0 === 'settings') {
      return settingsIndex(req, res);
    }

    if (seg0 === 'tarot') {
      if (segments.length === 1) return tarotIndex(req, res);
      if (segments.length === 2) {
        req.query.id = seg1;
        return tarotId(req, res);
      }
    }

    if (seg0 === 'tickets') {
      if (segments.length === 1) return ticketsIndex(req, res);
      if (segments.length === 2) {
        req.query.id = seg1;
        return ticketsId(req, res);
      }
    }

    if (seg0 === 'vault') {
      if (segments.length === 1) return vaultIndex(req, res);
      if (seg1 === 'upload') return vaultUpload(req, res);
    }

    return res.status(404).json({ error: `API route not found: /api/${routePath}` });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
