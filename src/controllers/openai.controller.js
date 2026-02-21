import { callAzureOpenAI } from '../services/openai.service.js';

export const proxyChatCompletions = async (req, res) => {
    try {
        const data = await callAzureOpenAI(req.body.messages, {
            temperature: req.body.temperature,
            max_tokens: req.body.max_tokens,
            ...req.body
        });
        res.json(data);
    } catch (err) {
        console.error("Azure error:", err.response?.data || err.message);
        res.status(500).json({
            error: "Azure OpenAI error",
            details: err.response?.data || err.message
        });
    }
};
