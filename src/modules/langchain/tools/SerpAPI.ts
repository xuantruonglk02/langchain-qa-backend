import { ConfigKey } from '@/common/configs/config-keys';
import { getEnvFilePath } from '@/common/helpers/utility-functions';
import dotenv from 'dotenv';
import { SerpAPI } from 'langchain/tools';
import { LangchainConfigs } from '../configs/configs';

dotenv.config({
    path: getEnvFilePath(),
});

export class SerpAPITool extends SerpAPI {
    constructor() {
        super(process.env[ConfigKey.SERPAPI_API_KEY], {
            location: LangchainConfigs.tools.serpAPI.location,
            hl: LangchainConfigs.tools.serpAPI.hl,
            gl: LangchainConfigs.tools.serpAPI.gl,
        });

        this.name = LangchainConfigs.tools.serpAPI.name;
        this.description = LangchainConfigs.tools.serpAPI.description;
    }
}
