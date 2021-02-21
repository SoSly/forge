import { expr } from "./Parser";
import { LabelResult, EvalFn } from "./Values";

export function label(expression: expr, comment: string): EvalFn {
    return () => expression.evalfn().then((res) => {
        return new LabelResult(res, comment);
    });
}
