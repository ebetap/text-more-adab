### Documentation for `text-more-adab`

## Overview

`text-more-adab` is a utility for sentiment analysis and text generation, providing an easy way to transform negative comments into encouraging messages. This package leverages sentiment analysis and text generation APIs to analyze the sentiment of a given text and rephrase negative comments positively.

## Installation

You can install `text-more-adab` via npm:

```sh
npm install text-more-adab
```

## Usage

### Basic Usage

To use `text-more-adab`, you need to import the package and create an instance of the `TextMoreAdab` class with the appropriate API keys and endpoints.

```javascript
const { TextMoreAdab } = require('text-more-adab');

// Configuration settings
const sentimentApiKey = 'YOUR_SENTIMENT_API_KEY';
const sentimentApiEndpoint = 'https://api.twinword.com/api/v6/text/sentiment/';
const textGenerationApiKey = 'YOUR_TEXT_GENERATION_API_KEY';
const textGenerationApiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// Create an instance of TextMoreAdab
const textMoreAdab = new TextMoreAdab(sentimentApiKey, sentimentApiEndpoint, textGenerationApiKey, textGenerationApiEndpoint);

// Transform a comment
const comment = "I really dislike this product.";
textMoreAdab.transformComment(comment).then(result => {
    console.log(result); // Output: "You're doing great! Keep up the good work!" or a positive rephrased comment
}).catch(error => {
    console.error(error.message);
});
```

### Methods

#### `analyzeSentiment(text)`

Analyzes the sentiment of the provided text.

- **Parameters**: `text` (string) - The text to be analyzed.
- **Returns**: Promise that resolves to the sentiment analysis result.

```javascript
textMoreAdab.analyzeSentiment("I love this product!").then(result => {
    console.log(result); // Output: Sentiment analysis result
}).catch(error => {
    console.error(error.message);
});
```

#### `rephraseNegative(text)`

Rephrases a negative comment into a positive one.

- **Parameters**: `text` (string) - The text to be rephrased.
- **Returns**: Promise that resolves to the rephrased text.

```javascript
textMoreAdab.rephraseNegative("I hate this.").then(result => {
    console.log(result); // Output: Positive rephrased comment
}).catch(error => {
    console.error(error.message);
});
```

#### `transformComment(comment)`

Transforms a negative comment into a positive one if the sentiment is negative. If the sentiment is not negative or rephrasing fails, returns a default encouraging message.

- **Parameters**: `comment` (string) - The comment to be transformed.
- **Returns**: Promise that resolves to the transformed comment.

```javascript
const comment = "This is terrible.";
textMoreAdab.transformComment(comment).then(result => {
    console.log(result); // Output: Positive rephrased comment or default encouraging message
}).catch(error => {
    console.error(error.message);
});
```

### Error Handling

The package includes custom error classes for handling specific errors:

- `SentimentAnalysisError`: Thrown when there is an error with the sentiment analysis API call.
- `TextGenerationError`: Thrown when there is an error with the text generation API call.

### Unit Testing

The package includes unit tests using Jest. To run the tests, use the following command:

```sh
npm test
```

## Development

### Future Improvements

1. **Support for More Languages**: Extend the sentiment analysis and text generation to support multiple languages.
2. **Advanced Sentiment Analysis**: Improve sentiment analysis accuracy by integrating more sophisticated NLP models.
3. **Customizable Prompts**: Allow users to provide custom prompts for text generation to tailor the output to their needs.
4. **Caching Mechanism**: Implement caching for API responses to reduce the number of API calls and improve performance.
5. **Detailed Logging**: Add detailed logging to provide more insights during development and debugging.
6. **Rate Limiting and Backoff**: Enhance rate limiting and backoff strategies to handle API rate limits more gracefully.

### Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure tests pass.
4. Commit your changes with descriptive commit messages.
5. Push your branch to your forked repository.
6. Create a pull request to the main repository.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Example

Here's a full example demonstrating how to use the `text-more-adab` package:

```javascript
const { TextMoreAdab } = require('text-more-adab');

// Configuration settings
const sentimentApiKey = 'YOUR_SENTIMENT_API_KEY';
const sentimentApiEndpoint = 'https://api.twinword.com/api/v6/text/sentiment/';
const textGenerationApiKey = 'YOUR_TEXT_GENERATION_API_KEY';
const textGenerationApiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

// Create an instance of TextMoreAdab
const textMoreAdab = new TextMoreAdab(sentimentApiKey, sentimentApiEndpoint, textGenerationApiKey, textGenerationApiEndpoint);

// Example usage
const comment = "This product is awful.";
textMoreAdab.transformComment(comment).then(result => {
    console.log("Transformed Comment:", result);
}).catch(error => {
    console.error("Error:", error.message);
});
```
