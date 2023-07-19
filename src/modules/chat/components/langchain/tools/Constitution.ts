import { ChainTool } from 'langchain/tools';
import { constitutionalChain } from '../chains/ConstitutionalChain';
import { LangchainConfigs } from '../configs/configs';

// export class VectorStoreQATool2 extends ChainTool {
//     constructor() {
//         const vectorDBQAChain = VectorDBQAChain.fromLLM(
//             chatOpenAIModel,
//             pineconePD.vectorStore,
//         );

//         super({
//             name: LangchainConfigs.tools.vectorStoreBannedContent.name,
//             description:
//                 LangchainConfigs.tools.vectorStoreBannedContent.description,
//             chain: vectorDBQAChain,
//         });
//     }
// }

export class Constitution extends ChainTool {
    constructor() {
        super({
            chain: constitutionalChain,
            name: LangchainConfigs.tools.constitution.name,
            description: LangchainConfigs.tools.constitution.description,
        });
    }
}
