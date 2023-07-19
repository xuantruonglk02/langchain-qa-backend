import { Calculator } from 'langchain/tools/calculator';
import { LangchainConfigs } from '../configs/configs';

export class CalculatorTool extends Calculator {
    constructor() {
        super();

        this.name = LangchainConfigs.tools.calculator.name;
        this.description = LangchainConfigs.tools.calculator.description;
    }
}
