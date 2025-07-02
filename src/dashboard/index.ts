import { Router } from 'express';
import { DocumentEngineClient } from '../api/Client.js';
import {
  createAuthMiddleware,
  dashboardHandler,
  uploadHandler,
  downloadHandler,
  deleteHandler,
  upload,
} from './routes.js';

/**
 * Create and configure the dashboard router
 * @param client Document Engine client
 * @returns Express router for dashboard routes
 */
export function createDashboardRouter(client: DocumentEngineClient): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware();

  // Dashboard home page
  router.get('/', authMiddleware, (req, res) => dashboardHandler(client, req, res));

  // File upload endpoint
  router.post('/upload', authMiddleware, upload.array('files'), (req, res) =>
    uploadHandler(client, req, res)
  );

  // File download endpoint
  router.get('/download/:id', authMiddleware, (req, res) => downloadHandler(client, req, res));

  // File delete endpoint
  router.post('/delete/:id', authMiddleware, (req, res) => deleteHandler(client, req, res));

  return router;
}

// Export all dashboard components
export * from './routes.js';
export * from './templates/dashboard.js';
export * from './templates/uploadResults.js';
export * from './templates/error.js';
