import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import authLogin from './api_handlers/auth/login.ts';
import authRegister from './api_handlers/auth/register.ts';
import authMe from './api_handlers/auth/me.ts';
import eventsIndex from './api_handlers/events/index.ts';
import eventsId from './api_handlers/events/[id].ts';
import ticketsIndex from './api_handlers/tickets/index.ts';
import ticketsId from './api_handlers/tickets/[id].ts';
import paymentQr from './api_handlers/payment/qr.ts';
import vaultIndex from './api_handlers/vault/index.ts';
import vaultUpload from './api_handlers/vault/upload.ts';
import tarotIndex from './api_handlers/tarot/index.ts';
import tarotId from './api_handlers/tarot/[id].ts';
import adminStats from './api_handlers/admin/stats.ts';
import adminUsers from './api_handlers/admin/users.ts';
import adminBankIndex from './api_handlers/admin/bank.ts';
import adminBankId from './api_handlers/admin/bank/[id].ts';
import adminBankActivate from './api_handlers/admin/bank/[id]/activate.ts';
import adminAddonsIndex from './api_handlers/admin/addons.ts';
import adminAddonsId from './api_handlers/admin/addons/[id].ts';

async function startServer() {
  const app = express();
  const PORT = 5173; // Run on 5173 to match Vite's default

  app.use(express.json({ limit: '10mb' }));

  const handle = (handler: any) => async (req: express.Request, res: express.Response) => {
    try {
      // Vercel expects params to be merged into query
      req.query = { ...req.query, ...req.params };
      await handler(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  app.all('/api/auth/login', handle(authLogin));
  app.all('/api/auth/register', handle(authRegister));
  app.all('/api/auth/me', handle(authMe));

  app.all('/api/events', handle(eventsIndex));
  app.all('/api/events/:id', handle(eventsId));

  app.all('/api/tickets', handle(ticketsIndex));
  app.all('/api/tickets/:id', handle(ticketsId));

  app.all('/api/payment/qr', handle(paymentQr));

  app.all('/api/vault', handle(vaultIndex));
  app.all('/api/vault/upload', handle(vaultUpload));

  app.all('/api/tarot', handle(tarotIndex));
  app.all('/api/tarot/:id', handle(tarotId));

  app.all('/api/admin/stats', handle(adminStats));
  app.all('/api/admin/users', handle(adminUsers));
  app.all('/api/admin/bank', handle(adminBankIndex));
  app.all('/api/admin/bank/:id', handle(adminBankId));
  app.all('/api/admin/bank/:id/activate', handle(adminBankActivate));
  app.all('/api/admin/addons', handle(adminAddonsIndex));
  app.all('/api/admin/addons/:id', handle(adminAddonsId));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
