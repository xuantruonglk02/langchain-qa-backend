import { Calculator } from 'langchain/tools/calculator';

export class CalculatorTool extends Calculator {
    constructor() {
        super();

        this.name = 'Calculator';
        this.description = 'Perform calculations on response';
    }
}
