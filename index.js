const axios = require('axios');

class TextMoreAdab {
    constructor(sentimentApiKey, sentimentApiEndpoint, textGenerationApiKey, textGenerationApiEndpoint) {
        if (!sentimentApiKey || typeof sentimentApiKey !== 'string') {
            throw new Error('Invalid sentiment API key');
        }
        if (!sentimentApiEndpoint || typeof sentimentApiEndpoint !== 'string') {
            throw new Error('Invalid sentiment API endpoint');
        }
        if (!textGenerationApiKey || typeof textGenerationApiKey !== 'string') {
            throw new Error('Invalid text generation API key');
        }
        if (!textGenerationApiEndpoint || typeof textGenerationApiEndpoint !== 'string') {
            throw new Error('Invalid text generation API endpoint');
        }

        this.sentimentApiKey = sentimentApiKey;
        this.sentimentApiEndpoint = sentimentApiEndpoint;
        this.textGenerationApiKey = textGenerationApiKey;
        this.textGenerationApiEndpoint = textGenerationApiEndpoint;

        this.axiosInstance = axios.create({
            timeout: 5000 // 5 seconds timeout for API calls
        });

        this.maxRetryAttempts = 3;
        this.retryDelayBase = 2000; // 2000 ms base delay for exponential backoff
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
                await this.wait(this.retryDelayBase * Math.pow(2, attempt));
            }
        }
        throw new Error(`API call failed after ${this.maxRetryAttempts} attempts.`);
    }

    async analyzeSentiment(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid input: text must be a non-empty string.');
        }

        const apiCall = async () => {
            try {
                const response = await this.axiosInstance.post(this.sentimentApiEndpoint, {
                    text: text
                }, {
                    headers: {
                        'X-Twaip-Key': this.sentimentApiKey
                    }
                });
                return response.data;
            } catch (error) {
                throw new Error(`Sentiment analysis API call failed: ${error.message}`);
            }
        };

        return await this.retryableAPICall(apiCall);
    }

    async rephraseNegative(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid input: text must be a non-empty string.');
        }

        const apiCall = async () => {
            try {
                const response = await this.axiosInstance.post(this.textGenerationApiEndpoint, {
                    prompt: `Transform this negative comment: "${text}" into an encouraging message.`,
                    max_tokens: 60
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.textGenerationApiKey}`
                    }
                });
                return response.data.choices[0].text.trim();
            } catch (error) {
                throw new Error(`Text generation API call failed: ${error.message}`);
            }
        };

        return await this.retryableAPICall(apiCall);
    }

    async transformComment(comment) {
        try {
            if (!comment || typeof comment !== 'string') {
                throw new Error('Invalid input: comment must be a non-empty string.');
            }

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
