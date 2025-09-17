const lintMarkdownCodeBlocks = require('./rules/lint-markdown-code-blocks');

module.exports = {
  rules: {
    'lint-markdown-code-blocks': lintMarkdownCodeBlocks,
  },
  processors: {
    markdown: {
      preprocess(text) {
        // Hack: wrap the markdown file in a dummy JS comment so ESLint feeds it
        // through our custom rule without needing a real markdown parser here.
        return [
          `// Markdown content for processing\n/* ${text.replace(
            /\*\//g,
            '*\\/'
          )} */`,
        ];
      },
      postprocess(messages) {
        const processedMessages = messages.flat().map((message) => {
          if (message.suggestions) {
            const processedSuggestions = message.suggestions.map(
              (suggestion) => {
                if (suggestion.fix) {
                  // Unescape */ in fix text
                  const fixedText = suggestion.fix.text.replace(
                    /\*\\\//g,
                    '*/'
                  );
                  return {
                    ...suggestion,
                    fix: {...suggestion.fix, text: fixedText},
                  };
                }
                return suggestion;
              }
            );
            return {...message, suggestions: processedSuggestions};
          }
          return message;
        });
        return processedMessages;
      },
      supportsAutofix: true,
    },
  },
};
