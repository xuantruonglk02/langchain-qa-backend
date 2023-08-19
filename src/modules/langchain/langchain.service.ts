import { Injectable, Logger } from '@nestjs/common';
import { PromptTemplate } from 'langchain';
import { LLMChain } from 'langchain/chains';
import mammoth from 'mammoth';
import { ChatConversationalAgent } from './agents/ChatConversationAgent';
import {
    CHECK_DOCUMENT_PROMPT_TEMPLATE,
    CHECK_PRINCIPLES_PROMPT_TEMPLATE,
    SUMMARIZE_PRINCIPLES_PROMPT_TEMPLATE,
} from './configs/prompts';
import { openAIModel } from './models/OpenAI';
import { pineconePrinciple } from './models/PineconePrinciple';

@Injectable()
export class LangchainService {
    constructor(private readonly logger: Logger) {}

    async callAgent(userId: string, conversationId: string, message: string) {
        try {
            const contradict =
                await this.checkUserInputContradictWithPrinciples(message);
            if (contradict) {
                return {
                    output: 'I have no idea about it',
                };
            }

            const chatAgent = new ChatConversationalAgent();
            await chatAgent.initialize({
                conversationId: conversationId,
                vectorStoreQuery: {
                    userId: userId,
                },
            });

            const aiResponse = await chatAgent.call(message);
            return aiResponse;
        } catch (error: any) {
            this.logger.error(
                'In callAgent()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }

    async checkUserInputContradictWithPrinciples(input: string) {
        try {
            const principlesList = await this.getRelevantPrinciples(input);
            const principles = await this.summarizeUserInputIntoBulletList(
                principlesList.join('.'),
            );

            const prompt = new PromptTemplate({
                template: CHECK_PRINCIPLES_PROMPT_TEMPLATE,
                inputVariables: ['input', 'principles'],
            });
            const chain = new LLMChain({
                llm: openAIModel,
                prompt,
                verbose: true,
            });
            const response = await chain.call({
                input,
                principles: principles.text,
            });
            return /yes/i.test(response.text);
        } catch (error: any) {
            this.logger.error(
                'In checkUserInputContradictWithPrinciples()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }

    async getRelevantPrinciples(input: string) {
        try {
            const vectorStoreRetriever =
                pineconePrinciple.vectorStore.asRetriever();
            const docs = await vectorStoreRetriever.getRelevantDocuments(input);
            const principles = docs.map((doc) =>
                doc.pageContent.replace(/\n/g, '.'),
            );
            return principles;
        } catch (error: any) {
            this.logger.error(
                'In getRelevantPrinciples()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }

    async summarizeUserInputIntoBulletList(input: string) {
        try {
            const prompt = new PromptTemplate({
                template: SUMMARIZE_PRINCIPLES_PROMPT_TEMPLATE,
                inputVariables: ['input'],
            });
            const chain = new LLMChain({ llm: openAIModel, prompt });
            const responses = await chain.call({
                input,
            });
            return responses;
        } catch (error: any) {
            this.logger.error(
                'In summarizeUserInputIntoBulletList()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }

    async checkDocument(filePath: string, topics: string[]) {
        try {
            const document = await mammoth.extractRawText({ path: filePath });
            const paragraphs = document.value.split('\n\n');
            const topicsString = topics.map((topic) => `- ${topic}`).join('\n');

            const response = await Promise.all(
                paragraphs.map((paragraph) =>
                    this.checkDocumentParagraph(paragraph, topicsString),
                ),
            );
            console.log(response);
        } catch (error: any) {
            this.logger.error(
                'In checkDocument()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }

    async checkDocumentParagraph(content: string, topicsString: string) {
        try {
            const promptTemplate = new PromptTemplate({
                template: CHECK_DOCUMENT_PROMPT_TEMPLATE,
                inputVariables: ['document', 'topics'],
            });
            const llmChain = new LLMChain({
                llm: openAIModel,
                prompt: promptTemplate,
            });
            const response = await llmChain.call({
                document: content,
                topics: topicsString,
            });
            console.log(response);
            return response;
        } catch (error: any) {
            this.logger.error(
                'In checkDocumentParagraph()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }
}
