export const LangchainConfigs = {
    models: {
        openAI: {
            modelName: 'gpt-3.5-turbo',
            temperature: 0.5,
            timeout: 5000,
        },
    },
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
            location: 'Austin,Texas,United States',
            hl: 'en',
            gl: 'us',
        },
        principle: {
            name: 'Principle',
            description: 'Provides absolutely accurate and factual information',
        },
        vectorStoreQA: {
            name: 'VectorStoreQA',
            description:
                "Gives agent the ability to access and find information in user's documents.",
        },
    },
};
