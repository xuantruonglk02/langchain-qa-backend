export const LangchainConfigs = {
    tools: {
        calculator: {
            name: 'Calculator',
            description: 'Perform calculations on response',
        },
        serpAPI: {
            name: 'SerpAPI',
            description:
                'Wrapper around SerpAPI - a real-time API to access Google search results',
        },
        vectorStoreQA: {
            name: 'VectorStoreQA',
            description:
                "Gives agent the ability to access and find information in user's documents.",
        },
        constitution: {
            name: 'Constitution',
            description:
                'Provides principles for the content of the conversation to follow',
        },
        truthQA: {
            name: 'TheTruth',
            description: 'Provides absolutely accurate and factual information',
        },
    },
};
