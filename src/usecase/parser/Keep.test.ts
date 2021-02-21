import { Interpreter } from './Interpreter';
import { Parser } from './Parser';
import { KeepResult } from './Values'

describe('Dice Keeping and Dropping Parsing and Evaluation', () => {
    let int: Interpreter;
    let p: Parser;

    beforeEach(() => {
        int = new Interpreter;
    })

    describe('error handling', () => {

    })

    describe('keep parsing', () => {
        it('keeps the highest n rolls with kh', async () => {
            expect.assertions(10);

            p = new Parser('4d6kh3');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as KeepResult).toBeDefined();
            const kr = res as KeepResult;
            expect(kr.raw.length).toEqual(3);
            expect(kr.excluded.length).toEqual(1);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[0]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[1]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[2]);
            expect(kr.total).toEqual(kr.raw.reduce((t, c) => t + c));
            expect(kr.total).toEqual(kr.roll.total - kr.excluded[0]);
        })

        it('keeps the highest n rolls with k', async () => {
            expect.assertions(10);

            p = new Parser('4d6k3');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as KeepResult).toBeDefined();
            const kr = res as KeepResult;
            expect(kr.raw.length).toEqual(3);
            expect(kr.excluded.length).toEqual(1);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[0]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[1]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[2]);
            expect(kr.total).toEqual(kr.raw.reduce((t, c) => t + c));
            expect(kr.total).toEqual(kr.roll.total - kr.excluded[0]);
        })

        it('keeps the lowest n rolls with kl', async () => {
            expect.assertions(10);

            p = new Parser('4d6kl3');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as KeepResult).toBeDefined();
            const kr = res as KeepResult;
            expect(kr.raw.length).toEqual(3);
            expect(kr.excluded.length).toEqual(1);
            expect(kr.excluded[0]).toBeGreaterThanOrEqual(kr.raw[0]);
            expect(kr.excluded[0]).toBeGreaterThanOrEqual(kr.raw[1]);
            expect(kr.excluded[0]).toBeGreaterThanOrEqual(kr.raw[2]);
            expect(kr.total).toEqual(kr.raw.reduce((t, c) => t + c));
            expect(kr.total).toEqual(kr.roll.total - kr.excluded[0]);
        })
    })

    describe('drop parsing', () => {
        it('drops the lowest n rolls with dl', async () => {
            expect.assertions(10);

            p = new Parser('4d6dl1');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as KeepResult).toBeDefined();
            const kr = res as KeepResult;
            expect(kr.raw.length).toEqual(3);
            expect(kr.excluded.length).toEqual(1);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[0]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[1]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[2]);
            expect(kr.total).toEqual(kr.raw.reduce((t, c) => t + c));
            expect(kr.total).toEqual(kr.roll.total - kr.excluded[0]);
        })

        it('drops the lowest n rolls with d', async () => {
            expect.assertions(10);

            p = new Parser('4d6d1');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as KeepResult).toBeDefined();
            const kr = res as KeepResult;
            expect(kr.raw.length).toEqual(3);
            expect(kr.excluded.length).toEqual(1);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[0]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[1]);
            expect(kr.excluded[0]).toBeLessThanOrEqual(kr.raw[2]);
            expect(kr.total).toEqual(kr.raw.reduce((t, c) => t + c));
            expect(kr.total).toEqual(kr.roll.total - kr.excluded[0]);
        })

        it('lowest the highest n rolls with dh', async () => {
            expect.assertions(10);

            p = new Parser('4d6dh1');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as KeepResult).toBeDefined();
            const kr = res as KeepResult;
            expect(kr.raw.length).toEqual(3);
            expect(kr.excluded.length).toEqual(1);
            expect(kr.excluded[0]).toBeGreaterThanOrEqual(kr.raw[0]);
            expect(kr.excluded[0]).toBeGreaterThanOrEqual(kr.raw[1]);
            expect(kr.excluded[0]).toBeGreaterThanOrEqual(kr.raw[2]);
            expect(kr.total).toEqual(kr.raw.reduce((t, c) => t + c));
            expect(kr.total).toEqual(kr.roll.total - kr.excluded[0]);
        })
    })

    describe('string handling', () => {
        it('converts the raw results to a human-readable string', async () => {
            p = new Parser('4d6kh3');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as KeepResult).toBeDefined();
            const rr = res as KeepResult;
            expect(rr.toString()).toEqual(`${rr.total} [${rr.raw[0]}, ${rr.raw[1]}, ${rr.raw[2]}, ~~${rr.excluded[0]}~~]`);
        })
    })
})
