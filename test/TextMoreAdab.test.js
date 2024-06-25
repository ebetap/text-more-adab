const { TextMoreAdab, SentimentAnalysisError, TextGenerationError } = require('../src/TextMoreAdab');

describe('TextMoreAdab', () => {
    let textMoreAdabInstance;

    beforeAll(() => {
        // Mock API keys and endpoints for testing
        const sentimentApiKey = 'mock-sentiment-api-key';
        const sentimentApiEndpoint = 'https://api.twinword.com/api/v6/text/sentiment/';
        const textGenerationApiKey = 'mock-text-generation-api-key';
        const textGenerationApiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

        textMoreAdabInstance = new TextMoreAdab(sentimentApiKey, sentimentApiEndpoint, textGenerationApiKey, textGenerationApiEndpoint);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('analyzeSentiment should handle API errors', async () => {
        const text = 'This is a negative comment.';
        const error = new Error('API call failed');

        // Mock axiosInstance post method to simulate API call failure
        jest.spyOn(textMoreAdabInstance.axiosInstance, 'post').mockRejectedValue(error);

        await expect(textMoreAdabInstance.analyzeSentiment(text)).rejects.toThrowError(SentimentAnalysisError);
    });

    test('rephraseNegative should handle API errors', async () => {
        const text = 'This is a negative comment.';
        const error = new Error('API call failed');

        // Mock axiosInstance post method to simulate API call failure
        jest.spyOn(textMoreAdabInstance.axiosInstance, 'post').mockRejectedValue(error);

        await expect(textMoreAdabInstance.rephraseNegative(text)).rejects.toThrowError(TextGenerationError);
    });

    // Add more test cases to cover other scenarios
});
