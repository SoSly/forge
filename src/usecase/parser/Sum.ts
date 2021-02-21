import { expr, Sum, Sum_$0 } from "./Parser";
import { EvalFn, NumberResult, SumPart, SumResult } from "./Values";

enum operations {
    ADD,
    SUB
}

type rightExpression = {op: string, rightExpression: expr};

export function sum(sum: Sum): EvalFn {
    return async () => {
        const results = await Promise.all([sum.head.evalfn()].concat(sum.tail.map(v => v.expr.evalfn())));
        const head = results.shift()!;
        const tail = results.map((part, i) => new SumPart(sum.tail[i].op, part));

        const total = tail.reduce<number>((t, c) => {
            if (c.operator == '-') {
                return t - c.value.total;
            }
            return t + c.value.total;
        }, head.total);
        
        return new SumResult(head, tail, total);
    }
}
