export const LangchainConfigs = {
    memory: {
        redisChatMemory: {
            sessionTTL: 3600,
            k: 100,
        },
    },
    tools: {
        calculator: {
            name: 'Calculator',
            description: 'Perform calculations on response',
        },
        constitution: {
            name: 'Constitution',
            description:
                'Provides principles for the content of the conversation to follow',
        },
        serpAPI: {
            name: 'SerpAPI',
            description:
                'Wrapper around SerpAPI - a real-time API to access Google search results',
        },
        truthQA: {
            name: 'TheTruth',
            description: 'Provides absolutely accurate and factual information',
        },
        vectorStoreQA: {
            name: 'VectorStoreQA',
            description:
                "Gives agent the ability to access and find information in user's documents.",
        },
    },
};
