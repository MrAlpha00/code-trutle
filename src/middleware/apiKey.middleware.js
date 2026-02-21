import prisma from '../prisma/client.js';

export const requireApiKeyOrPass = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
        // Legacy support: allow the request to proceed without an API key,
        // but we won't be able to associate it with a repository in the DB.
        req.repository = null;
        return next();
    }

    try {
        const repository = await prisma.repository.findUnique({
            where: { apiKey }
        });

        if (!repository) {
            return res.status(401).json({ error: 'Invalid API Key provided' });
        }

        req.repository = repository;
        next();
    } catch (error) {
        console.error('API Key validation error:', error);
        res.status(500).json({ error: 'Internal server error during DB validation' });
    }
};
