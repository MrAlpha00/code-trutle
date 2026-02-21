import express from 'express';
import { handleReview, getReviews } from '../controllers/review.controller.js';
import { requireApiKeyOrPass } from '../middleware/apiKey.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// The public review endpoint used by Github Actions
router.post('/', requireApiKeyOrPass, handleReview);

// The dashboard endpoint used to fetch reviews (requires dashboard auth)
router.get('/', requireAuth, getReviews);

export default router;
