import axios from "axios";

/**
 * Calls Azure OpenAI with the given messages.
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Optional parameters like temperature
 * @returns {Promise<Object>} - The response data from Azure OpenAI
 */
export async function callAzureOpenAI(messages, options = {}) {
    const {
        AZURE_ENDPOINT,
        AZURE_API_KEY,
        AZURE_DEPLOYMENT,
        AZURE_API_VERSION
    } = process.env;

    const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;

    const payload = {
        messages,
        ...options
    };

    const response = await axios.post(url, payload, {
        headers: {
            "api-key": AZURE_API_KEY,
            "Content-Type": "application/json"
        }
    });

    return response.data;
}
