import { ConfigKey } from '@/common/configs/config-keys';
import dotenv from 'dotenv';
import { SerpAPI } from 'langchain/tools';

dotenv.config();

export class SerpAPITool extends SerpAPI {
    constructor() {
        super(process.env[ConfigKey.SERPAPI_API_KEY], {
            location: 'Austin,Texas,United States',
            hl: 'en',
            gl: 'us',
        });

        this.name = 'SerpAPI';
        this.description =
            'Wrapper around SerpAPI - a real-time API to access Google search results';
    }
}
