import express from 'express';
import { getRepos, createRepo, regenerateApiKey } from '../controllers/repo.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// All repo routes require authentication
router.use(requireAuth);

router.get('/', getRepos);
router.post('/', createRepo);
router.post('/:id/regenerate-key', regenerateApiKey);

export default router;
