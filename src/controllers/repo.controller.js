import crypto from 'crypto';
import prisma from '../prisma/client.js';

// Get all repositories for the logged-in user
export const getRepos = async (req, res) => {
    try {
        const repos = await prisma.repository.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(repos);
    } catch (error) {
        console.error('Error fetching repos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new repository
export const createRepo = async (req, res) => {
    try {
        const { name, githubRepoUrl } = req.body;

        if (!name || !githubRepoUrl) {
            return res.status(400).json({ error: 'Name and GitHub URL are required' });
        }

        // Generate a unique API key: e.g., ct_...
        const apiKey = 'ct_' + crypto.randomBytes(32).toString('hex');

        const repo = await prisma.repository.create({
            data: {
                name,
                githubRepoUrl,
                apiKey,
                userId: req.user.userId
            }
        });

        res.status(201).json(repo);
    } catch (error) {
        console.error('Error creating repo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Regenerate API key for a repository
export const regenerateApiKey = async (req, res) => {
    try {
        const { id } = req.params;

        const repo = await prisma.repository.findUnique({ where: { id } });

        if (!repo) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        if (repo.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const apiKey = 'ct_' + crypto.randomBytes(32).toString('hex');

        const updatedRepo = await prisma.repository.update({
            where: { id },
            data: { apiKey }
        });

        res.json(updatedRepo);
    } catch (error) {
        console.error('Error regenerating API key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
