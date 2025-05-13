import { analyzeContent } from './contentAnalyzer';

async function testContentAnalyzer() {
  // Test cases with different types of websites
  const testUrls = ['https://www.wikipedia.org', 'https://nodejs.org'];

  for (const url of testUrls) {
    console.log('\nTesting content analyzer with:', url);
    console.log('----------------------------------------');

    try {
      const results = await analyzeContent(url);

      // Log results
      console.log('Analysis Results:');
      Object.entries(results).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      // Validate results
      const validations = [
        {
          test: () => results.wordCount > 0,
          message: 'Word count should be positive',
        },
        {
          test: () => results.uniqueWords <= results.wordCount,
          message: 'Unique words should not exceed total words',
        },
        {
          test: () => results.images >= 0,
          message: 'Image count should be non-negative',
        },
        {
          test: () => results.videos >= 0,
          message: 'Video count should be non-negative',
        },
        {
          test: () => results.backlinks >= 0,
          message: 'Backlink count should be non-negative',
        },
        {
          test: () => results.language !== 'Unknown',
          message: 'Language should be detected',
        },
      ];

      console.log('\nValidation Results:');
      validations.forEach(({ test, message }) => {
        const passed = test();
        console.log(`${passed ? '✓' : '✗'} ${message}`);
      });
    } catch (error) {
      console.error(`Error analyzing ${url}:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
      }
    }
  }
}

// Run the tests
console.log('Starting content analyzer tests...\n');
testContentAnalyzer()
  .then(() => console.log('\nTests completed'))
  .catch((error) => console.error('\nTest suite failed:', error));
