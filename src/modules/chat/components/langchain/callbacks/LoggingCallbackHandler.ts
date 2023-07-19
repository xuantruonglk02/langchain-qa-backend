import { createWinstonLoggerLangchain } from '@/common/modules/winston.module';
import { BaseTracer } from 'langchain/callbacks';
import { Logger } from 'winston';

export class LoggingCallbackHandler extends BaseTracer {
    name: string;
    logger: Logger;

    constructor() {
        super();
        this.logger = createWinstonLoggerLangchain();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    persistRun(_run: any) {
        return Promise.resolve();
    }

    // utility methods
    getParents(run: any) {
        const parents = [];
        let currentRun = run;
        while (currentRun.parent_run_id) {
            const parent = this.runMap.get(currentRun.parent_run_id);
            if (parent) {
                parents.push(parent);
                currentRun = parent;
            } else {
                break;
            }
        }
        return parents;
    }
    getBreadcrumbs(run: any) {
        const parents = this.getParents(run).reverse();
        const string = [...parents, run]
            .map((parent) => {
                const name = `${parent.execution_order}:${parent.run_type}:${parent.name}`;
                return name;
            })
            .join(' > ');
        return string;
    }

    // logging methods
    onChainStart(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[chain/start] [${crumbs}] Entering Chain run with input: ${tryJsonStringify(
                run.inputs,
                '[inputs]',
            )}`,
        );
    }
    onChainEnd(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[chain/end] [${crumbs}] [${elapsed(
                run,
            )}] Exiting Chain run with output: ${tryJsonStringify(
                run.outputs,
                '[outputs]',
            )}`,
        );
    }
    onChainError(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[chain/error] [${crumbs}] [${elapsed(
                run,
            )}] Chain run errored with error: ${tryJsonStringify(
                run.error,
                '[error]',
            )}`,
        );
    }
    onLLMStart(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        const inputs =
            'prompts' in run.inputs
                ? { prompts: run.inputs.prompts.map((p: any) => p.trim()) }
                : run.inputs;
        this.logger.info(
            `[llm/start] [${crumbs}] Entering LLM run with input: ${tryJsonStringify(
                inputs,
                '[inputs]',
            )}`,
        );
    }
    onLLMEnd(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[llm/end] [${crumbs}] [${elapsed(
                run,
            )}] Exiting LLM run with output: ${tryJsonStringify(
                run.outputs,
                '[response]',
            )}`,
        );
    }
    onLLMError(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[llm/error] [${crumbs}] [${elapsed(
                run,
            )}] LLM run errored with error: ${tryJsonStringify(
                run.error,
                '[error]',
            )}`,
        );
    }
    onToolStart(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[tool/start] [${crumbs}] Entering Tool run with input: "${run.inputs.input?.trim()}"`,
        );
    }
    onToolEnd(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[tool/end] [${crumbs}] [${elapsed(
                run,
            )}] Exiting Tool run with output: "${run.outputs?.output?.trim()}"`,
        );
    }
    onToolError(run: any) {
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[tool/error] [${crumbs}] [${elapsed(
                run,
            )}] Tool run errored with error: ${tryJsonStringify(
                run.error,
                '[error]',
            )}`,
        );
    }
    onAgentAction(run: any) {
        const agentRun = run;
        const crumbs = this.getBreadcrumbs(run);
        this.logger.info(
            `[agent/action] [${crumbs}] Agent selected action: ${tryJsonStringify(
                agentRun.actions[agentRun.actions.length - 1],
                '[action]',
            )}`,
        );
    }
}

function elapsed(run: any) {
    if (!run.end_time) return '';
    const elapsed = run.end_time - run.start_time;
    if (elapsed < 1000) {
        return `${elapsed}ms`;
    }
    return `${(elapsed / 1000).toFixed(2)}s`;
}

function tryJsonStringify(obj: any, fallback: any) {
    try {
        return JSON.stringify(obj, null, 2);
    } catch (err) {
        return fallback;
    }
}
