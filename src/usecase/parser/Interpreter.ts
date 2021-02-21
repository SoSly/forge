import {DiceExpression, expr} from './Parser';
import {Value} from './Values';

export class Interpreter {
    constructor() {}

    public async interpret(ex: DiceExpression): Promise<Value> {
        return executeExpression(ex.expr)
            .catch(err => Promise.reject(err));
    }
}

async function executeExpression(ex: expr): Promise<Value> {
    switch (ex.kind) {
        default:
            return ex.evalfn();
    }
}
