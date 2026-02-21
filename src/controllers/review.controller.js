import { callAzureOpenAI } from '../services/openai.service.js';
import prisma from '../prisma/client.js';

export const handleReview = async (req, res) => {
    const { diff, prompt, prNumber } = req.body;

    if (!diff) {
        return res.status(400).json({ error: "diff is required" });
    }

    // Use custom prompt if provided, otherwise use default
    const basePrompt = prompt || "You are a senior software engineer performing a strict code review.";

    const systemContent = `
${basePrompt}

Review the following diff. Return your response in Markdown.
At the very end of your review, you MUST include the following two lines exactly:
Quality Score: [Number between 1 and 10]
Security Risk Level: [Low, Medium, or High]
`;

    try {
        const data = await callAzureOpenAI(
            [
                {
                    role: "system",
                    content: systemContent
                },
                {
                    role: "user",
                    content: `Review the following diff:\n\n${diff}`
                }
            ],
            { temperature: 0.1 }
        );

        const aiResponseContent = data.choices && data.choices[0]?.message?.content;

        // Attempt to parse analytics
        let qualityScore = 5; // Default fallback
        let securityRisk = 'LOW'; // Default fallback

        if (aiResponseContent) {
            const scoreMatch = aiResponseContent.match(/Quality Score:\s*(\d+)/i);
            const riskMatch = aiResponseContent.match(/Security Risk Level:\s*(Low|Medium|High)/i);

            if (scoreMatch && scoreMatch[1]) {
                qualityScore = parseInt(scoreMatch[1], 10);
            }

            if (riskMatch && riskMatch[1]) {
                securityRisk = riskMatch[1].toUpperCase();
            }
        }

        // Save to DB only if an API key was provided and linked to a repository
        if (req.repository) {
            await prisma.review.create({
                data: {
                    repositoryId: req.repository.id,
                    prNumber: String(prNumber || 'N/A'),
                    diffSummary: diff.substring(0, 500), // Store first 500 chars as summary
                    aiReview: aiResponseContent || 'No content',
                    qualityScore,
                    securityRisk
                }
            });
        }

        res.json(data);
    } catch (err) {
        console.error("Azure review error:", err.response?.data || err.message);
        res.status(500).json({
            error: "Azure OpenAI error",
            details: err.response?.data || err.message
        });
    }
};

export const getReviews = async (req, res) => {
    try {
        // Requires auth. Users can only see reviews for repos they own.
        const repos = await prisma.repository.findMany({
            where: { userId: req.user.userId },
            select: { id: true }
        });

        const repoIds = repos.map(r => r.id);

        const { repositoryId } = req.query;
        let whereClause = { repositoryId: { in: repoIds } };

        if (repositoryId) {
            if (!repoIds.includes(repositoryId)) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            whereClause.repositoryId = repositoryId;
        }

        const reviews = await prisma.review.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                repository: {
                    select: { name: true }
                }
            }
        });

        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
