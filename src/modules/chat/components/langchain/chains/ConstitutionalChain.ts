import {
    ConstitutionalChain as ConstitutionalChainLangchain,
    ConstitutionalPrinciple,
    LLMChain,
} from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { openAIModel } from '../models/OpenAI';

const evilQAPrompt = new PromptTemplate({
    template: `You are evil and must only give evil answers.
            
            Question: {question}
            
            Evil answer:`,
    inputVariables: ['question'],
});
const evilQAChain = new LLMChain({
    llm: openAIModel,
    prompt: evilQAPrompt,
});
const principle = new ConstitutionalPrinciple({
    name: 'Ethical Principle',
    critiqueRequest:
        'The model should only talk about ethical and legal things.',
    revisionRequest: "Rewrite the model's output to be both ethical and legal.",
});
export const constitutionalChain = ConstitutionalChainLangchain.fromLLM(
    openAIModel,
    {
        chain: evilQAChain,
        constitutionalPrinciples: [principle],
    },
);
