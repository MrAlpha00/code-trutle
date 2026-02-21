import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import repoRoutes from './routes/repo.routes.js';
import reviewRoutes from './routes/review.routes.js';
import openaiRoutes from './routes/openai.routes.js';

dotenv.config();

// --- Environment Variable Validation ---
const requiredEnvVars = ['AZURE_ENDPOINT', 'AZURE_API_KEY', 'AZURE_DEPLOYMENT', 'AZURE_API_VERSION', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`❌ Missing required environment variable: ${envVar}`);
        // Temporarily commenting out exit so app can run locally without Azure keys for UI building
        // process.exit(1); 
    }
}

const PORT = process.env.PORT || 3000;
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// --- Routes ---
app.get('/', (_, res) => {
    res.send('🐢 Code Turtle SaaS is running');
});

// SaaS API Routes
app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);

// Legacy Proxy / Review Routes
app.use('/review', reviewRoutes);
app.use('/v1/chat/completions', openaiRoutes);


app.listen(PORT, () => {
    console.log(`🐢 Code Turtle SaaS running on http://localhost:${PORT}`);
});
