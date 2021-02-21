import { Interpreter } from './Interpreter';
import { Parser } from './Parser';
import { KeepResult, RollResult, SumResult } from './Values';

describe('Sum Parsing and Evaluation', () => {
    let int: Interpreter;
    let p: Parser;

    beforeEach(() => {
        int = new Interpreter;
    })

    it('can add integers', async () => {
        expect.assertions(4);

        p = new Parser('2 + 2');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as SumResult).toBeDefined();
        const sr = res as SumResult;
        expect(sr.total).toEqual(4);
    })

    it('can subtract integers', async () => {
        expect.assertions(4);

        p = new Parser('3 - 1');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as SumResult).toBeDefined();
        const sr = res as SumResult;
        expect(sr.total).toEqual(2);
    })

    it('can sum dice', async () => {
        expect.assertions(5);

        p = new Parser('1d20 + 8');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as SumResult).toBeDefined();
        const sr = res as SumResult;
        expect(sr.head as RollResult).toBeDefined();
        expect(sr.total).toEqual(sr.head.total + 8);
    })

    it('can sum complex dice expressions', async () => {
        expect.assertions(5);

        p = new Parser('27 - 4d6kh3');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as SumResult).toBeDefined();
        const sr = res as SumResult;
        expect(sr.tail[0].value as KeepResult).toBeDefined();
        expect(sr.total).toEqual(27 - sr.tail[0].value.total);
    })

    it('can sum complex dice expressions with other dice expressions', async () => {
        expect.assertions(6)

        p = new Parser('3d6kh2 + 4d6kh3');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as SumResult).toBeDefined();
        const sr = res as SumResult;
        expect(sr.head as KeepResult).toBeDefined();
        expect(sr.tail[0].value as KeepResult).toBeDefined();
        expect(sr.total).toEqual(sr.head.total + sr.tail[0].value.total);
    })

    it('can print a meaningful string of the results of complex dice summations', async () => {
        expect.assertions(4);

        p = new Parser('27 - 4d6kh3');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as SumResult).toBeDefined();
        const sr = res as SumResult;
        expect(sr.toString()).toEqual(`27 - ${sr.tail[0].value.toString()} = ${sr.total}`);
    })

    it('can sum multiple values together', async () => {
        expect.assertions(4);

        p = new Parser('1 + 2 + 3 + 4');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as SumResult).toBeDefined();
        const sr = res as SumResult;
        expect(sr.toString()).toEqual('1 + 2 + 3 + 4 = 10');
    })
})
