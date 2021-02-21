// An EvalFn is used to evaluate an expression
export type EvalFn = () => Promise<Value>;

// Values are the possible result values available
export type Value = KeepResult | LabelResult | NumberResult | RollResult | SumResult;

// A KeepResult is the limited result of a dice roll
export class KeepResult {
    public roll: RollResult;
    public raw: number[];
    public excluded: number[];

    constructor(roll: RollResult, raw: number[], excluded: number[]) {
        this.roll = roll;
        this.raw = raw;
        this.excluded = excluded;
    }

    get total(): number {
        return this.raw.reduce((t, c) => t + c)
    }
    
    toString(): string {
        const exlStrs = this.excluded.map((ex: number): string => `~~${ex}~~`);
        return `${this.total} \[${this.raw.map(a => a.toString()).concat(exlStrs).join(', ')}\]`;
    }
}

// A LabelResult is the value of a comment
export class LabelResult {
    public expr: Value;
    public comment: string;
    
    constructor(expr: Value, comment: string) {
        this.expr = expr;
        this.comment = comment;
    }

    get total(): number {
        return this.expr.total;
    }

    toString(): string {
        return `${this.expr.toString()}\`${this.comment}\``;
    }
}

// A NumberResult is the value of a raw number
export class NumberResult {
    public total: number;

    constructor(n: number) {
        this.total = n;
    }

    toString(): string {
        return this.total.toString();
    }
}

// A RollResult is the result of a dice roll
export class RollResult {
    raw: number[]
    
    constructor(raw: number[]) {
        this.raw = raw;
    }

    get total(): number {
        return this.raw.reduce((t, c) => t + c)
    }
    
    toString(): string {
        return `${this.total} \[${this.raw.map(a => a.toString()).join(', ')}\]`;
    }
}

// A SumResult is the result of a sum total
export class SumResult {
    head: Value;
    tail: SumPart[];
    total: number;

    constructor(head: Value, tail: SumPart[], total: number) {
        this.head = head;
        this.tail = tail;
        this.total = total;
    }

    toString(): string {
        return `${this.tail.reduce<string>((s, n) => `${s} ${n.operator} ${n.value.toString()}`, this.head.toString())} = ${this.total}`;
    }
}

// A SumPart is part of a sum
export class SumPart {
    operator: string;
    value: Value

    constructor(operator: string, value: Value) {
        this.operator = operator;
        this.value = value;
    }
}
