import { ConfigKey } from '@/common/configs/config-keys';
import dotenv from 'dotenv';
import { SerpAPI } from 'langchain/tools';
import { LangchainConfigs } from '../configs/configs';

dotenv.config();

export class SerpAPITool extends SerpAPI {
    constructor() {
        super(process.env[ConfigKey.SERPAPI_API_KEY], {
            location: 'Austin,Texas,United States',
            hl: 'en',
            gl: 'us',
        });

        this.name = LangchainConfigs.tools.serpAPI.name;
        this.description = LangchainConfigs.tools.serpAPI.description;
    }
}
