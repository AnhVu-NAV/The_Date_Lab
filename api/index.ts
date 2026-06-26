import type { VercelRequest, VercelResponse } from '@vercel/node';

// Admin
import adminAddons from '../api_handlers/admin/addons_main.js';
import adminAddonsId from '../api_handlers/admin/addons/[id].js';
import adminBank from '../api_handlers/admin/bank_main.js';
import adminBankId from '../api_handlers/admin/bank/[id]_main.js';
import adminBankIdActivate from '../api_handlers/admin/bank/[id]/activate.js';
import adminSettings from '../api_handlers/admin/settings.js';
import adminStats from '../api_handlers/admin/stats.js';
import adminUsers from '../api_handlers/admin/users.js';

// Auth
import authLogin from '../api_handlers/auth/login.js';
import authMe from '../api_handlers/auth/me.js';
import authRegister from '../api_handlers/auth/register.js';

// Events
import eventsIndex from '../api_handlers/events/index.js';
import eventsId from '../api_handlers/events/[id].js';

// Gemini
import geminiChatbot from '../api_handlers/gemini/chatbot.js';
import geminiQuiz from '../api_handlers/gemini/quiz.js';

// Payment
import paymentQr from '../api_handlers/payment/qr.js';

// Settings
import settingsIndex from '../api_handlers/settings/index.js';

// Tarot
import tarotIndex from '../api_handlers/tarot/index.js';
import tarotId from '../api_handlers/tarot/[id].js';

// Tickets
import ticketsIndex from '../api_handlers/tickets/index.js';
import ticketsId from '../api_handlers/tickets/[id].js';

// Vault
import vaultIndex from '../api_handlers/vault/index.js';
import vaultUpload from '../api_handlers/vault/upload.js';
import vaultId from '../api_handlers/vault/[id].js';

// Admin Vault
import adminVaultMain from '../api_handlers/admin/vault_main.js';
import adminVaultId from '../api_handlers/admin/vault/[id].js';

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
      if (seg1 === 'vault') {
        if (segments.length === 2) return await adminVaultMain(req, res);
        if (segments.length === 3) {
          req.query.id = seg2;
          return await adminVaultId(req, res);
        }
      }
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
      if (segments.length === 2 && seg1 !== 'upload') {
        req.query.id = seg1;
        return await vaultId(req, res);
      }
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
