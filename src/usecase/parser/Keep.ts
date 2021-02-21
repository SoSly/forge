import {Roll} from './Parser';
import {EvalFn, KeepResult, RollResult} from './Values';

const types = /[k|d|kl|kh|dl|dh]{1}/;

enum operations {
    HIGHEST,
    LOWEST,
}

export function keep(rollExpression: Roll, t: string, a: number): EvalFn {
    if (!types.exec(t)) {
        throw new Error(`invalid type`);
    }

    let operation: operations;
    let amount: number = 0;
    switch (t) {
        case 'k':
        case 'kh':
            amount = a;
            operation = operations.HIGHEST;
            break;
        case 'd':
        case 'dl':
            amount = rollExpression.amount.value - a;
            operation = operations.HIGHEST;
            break;
        case 'kl':
            amount = a;
            operation = operations.LOWEST;
            break;
        case 'dh':
            amount = rollExpression.amount.value - a;
            operation = operations.LOWEST;
            break;
    }

    return () => rollExpression.evalfn().then((roll: RollResult): KeepResult => {
        let excluded: number[] = [];

        // dereference the roll raw values and sort them as integers
        let raw = [...roll.raw].sort((a, b) => a - b);
        
        // if we want the highest then we need to reverse the list
        if (operation == operations.HIGHEST) {
            raw.reverse();
        }

        // pop the ones we don't want off into the exclusions array
        for (let i = rollExpression.amount.value; i > amount; i--) {
            excluded.push(raw.pop()!);
        }

        return new KeepResult(roll, raw, excluded)
    })
}
