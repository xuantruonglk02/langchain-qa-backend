export interface IVectorStoreQuery {
    userId: string;
    fileIds?: string;
}
export interface IInitializeAgentOptions {
    conversationId: string;
    vectorStoreQuery: IVectorStoreQuery;
}
