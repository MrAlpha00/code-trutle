import express from 'express';
import { proxyChatCompletions } from '../controllers/openai.controller.js';

const router = express.Router();

router.post('/', proxyChatCompletions);

export default router;
