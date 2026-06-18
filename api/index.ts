import type { VercelRequest, VercelResponse } from '@vercel/node';

// Admin
import adminAddons from '../api_handlers/admin/addons_main';
import adminAddonsId from '../api_handlers/admin/addons/[id]';
import adminBank from '../api_handlers/admin/bank_main';
import adminBankId from '../api_handlers/admin/bank/[id]_main';
import adminBankIdActivate from '../api_handlers/admin/bank/[id]/activate';
import adminSettings from '../api_handlers/admin/settings';
import adminStats from '../api_handlers/admin/stats';
import adminUsers from '../api_handlers/admin/users';

// Auth
import authLogin from '../api_handlers/auth/login';
import authMe from '../api_handlers/auth/me';
import authRegister from '../api_handlers/auth/register';

// Events
import eventsIndex from '../api_handlers/events/index';
import eventsId from '../api_handlers/events/[id]';

// Gemini
import geminiChatbot from '../api_handlers/gemini/chatbot';
import geminiQuiz from '../api_handlers/gemini/quiz';

// Payment
import paymentQr from '../api_handlers/payment/qr';

// Settings
import settingsIndex from '../api_handlers/settings/index';

// Tarot
import tarotIndex from '../api_handlers/tarot/index';
import tarotId from '../api_handlers/tarot/[id]';

// Tickets
import ticketsIndex from '../api_handlers/tickets/index';
import ticketsId from '../api_handlers/tickets/[id]';

// Vault
import vaultIndex from '../api_handlers/vault/index';
import vaultUpload from '../api_handlers/vault/upload';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

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
        if (segments.length === 2) return await adminAddons(req, res);
        if (segments.length === 3) {
          req.query.id = seg2;
          return await adminAddonsId(req, res);
        }
      }
      if (seg1 === 'bank') {
        if (segments.length === 2) return await adminBank(req, res);
        if (segments.length === 3) {
          req.query.id = seg2;
          return await adminBankId(req, res);
        }
        if (segments.length === 4 && seg3 === 'activate') {
          req.query.id = seg2;
          return await adminBankIdActivate(req, res);
        }
      }
      if (seg1 === 'settings') return await adminSettings(req, res);
      if (seg1 === 'stats') return await adminStats(req, res);
      if (seg1 === 'users') return await adminUsers(req, res);
    }

    if (seg0 === 'auth') {
      if (seg1 === 'login') return await authLogin(req, res);
      if (seg1 === 'me') return await authMe(req, res);
      if (seg1 === 'register') return await authRegister(req, res);
    }

    if (seg0 === 'events') {
      if (segments.length === 1) return await eventsIndex(req, res);
      if (segments.length === 2) {
        req.query.id = seg1;
        return await eventsId(req, res);
      }
    }

    if (seg0 === 'gemini') {
      if (seg1 === 'chatbot') return await geminiChatbot(req, res);
      if (seg1 === 'quiz') return await geminiQuiz(req, res);
    }

    if (seg0 === 'payment' && seg1 === 'qr') {
      return await paymentQr(req, res);
    }

    if (seg0 === 'settings') {
      return await settingsIndex(req, res);
    }

    if (seg0 === 'tarot') {
      if (segments.length === 1) return await tarotIndex(req, res);
      if (segments.length === 2) {
        req.query.id = seg1;
        return await tarotId(req, res);
      }
    }

    if (seg0 === 'tickets') {
      if (segments.length === 1) return await ticketsIndex(req, res);
      if (segments.length === 2) {
        req.query.id = seg1;
        return await ticketsId(req, res);
      }
    }

    if (seg0 === 'vault') {
      if (segments.length === 1) return await vaultIndex(req, res);
      if (seg1 === 'upload') return await vaultUpload(req, res);
    }

    return res.status(404).json({ error: `API route not found: /api/${routePath}` });
  } catch (error: any) {
    console.error('API Error:', error);
    const message = error?.message || 'Internal Server Error';
    const isConfigError = message.startsWith('Missing required environment variable:');
    return res.status(500).json({
      error: isConfigError ? message : 'Internal Server Error',
    });
  }
}
