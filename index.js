const axios = require('axios');

// Replace with your actual API keys and endpoints
const sentimentApiKey = 'YOUR_SENTIMENT_API_KEY';
const sentimentApiEndpoint = 'https://api.twinword.com/api/v6/text/sentiment/';
const textGenerationApiKey = 'YOUR_TEXT_GENERATION_API_KEY';
const textGenerationApiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

class TextMoreAdab {
    constructor() {
        this.sentimentApiKey = sentimentApiKey;
        this.sentimentApiEndpoint = sentimentApiEndpoint;
        this.textGenerationApiKey = textGenerationApiKey;
        this.textGenerationApiEndpoint = textGenerationApiEndpoint;
        this.maxRetryAttempts = 3; // Maximum number of retry attempts
        this.axiosInstance = axios.create({
            timeout: 5000, // 5 seconds timeout for API calls
        });
    }

    async retryableAPICall(apiCall) {
        let attempt = 0;
        while (attempt < this.maxRetryAttempts) {
            try {
                const response = await apiCall();
                return response;
            } catch (error) {
                console.error(`API call attempt ${attempt + 1} failed:`, error.message);
                attempt++;
                await this.wait(2000 * Math.pow(2, attempt)); // Exponential backoff
            }
        }
        throw new Error(`API call failed after ${this.maxRetryAttempts} attempts.`);
    }

    async analyzeSentiment(text) {
        const apiCall = async () => {
            const response = await this.axiosInstance.post(this.sentimentApiEndpoint, {
                text: text
            }, {
                headers: {
                    'X-Twaip-Key': this.sentimentApiKey
                }
            });
            return response.data;
        };

        return await this.retryableAPICall(apiCall);
    }

    async rephraseNegative(text) {
        const apiCall = async () => {
            const response = await this.axiosInstance.post(this.textGenerationApiEndpoint, {
                prompt: `Transform this negative comment: "${text}" into an encouraging message.`,
                max_tokens: 60
            }, {
                headers: {
                    'Authorization': `Bearer ${this.textGenerationApiKey}`
                }
            });
            return response.data.choices[0].text.trim();
        };

        return await this.retryableAPICall(apiCall);
    }

    async transformComment(comment) {
        try {
            const sentimentData = await this.analyzeSentiment(comment);
            if (sentimentData && sentimentData.type === 'negative') {
                const positiveComment = await this.rephraseNegative(comment);
                if (positiveComment) {
                    return positiveComment;
                }
            }
            // If sentiment is not negative or rephrasing fails, return an encouraging message
            return `You're doing great! Keep up the good work!`;
        } catch (error) {
            console.error('Error transforming comment:', error.message);
            return `You're doing great! Keep up the good work!`;
        }
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = TextMoreAdab;
