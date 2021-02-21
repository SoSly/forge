import {Interpreter} from './Interpreter';
import {Parser} from './Parser';
import {RollResult} from './Values';

describe('Dice Expression Parsing and Evaluation', () => {
    let int: Interpreter;
    let p: Parser;

    beforeEach(() => {
        int = new Interpreter;
    })

    xdescribe('error handling', () => {
        it('throws an error if the incorrect number of sides are entered', async () => {
            const sidesToTest = [-5, -1, 0, 1, 1000];
            expect.assertions(1 * sidesToTest.length);
            
            for (let sides of sidesToTest) {
                try {
                    p = new Parser(`1d${sides}`);
                    p.parse();
                }
                catch (err) {
                    expect(err).not.toBe(null);
                }
            }
        })

        it('throws an error if the incorrect number of dice are entered', async () => {
            const diceToTest = [-5, -1, 0, 10000];
            expect.assertions(1 * diceToTest.length);
            
            for (let dice of diceToTest) {
                try {
                    p = new Parser(`${dice}d6`);
                    p.parse();
                }
                catch (err) {
                    expect(err).not.toBe(null);
                }
            }
        })

        it('returns an AST error if the expression does not make sense', async () => {
            expect.assertions(2);
            p = new Parser('1dA');
            const parsed1 = p.parse();
            expect(parsed1.errs.length).toBeGreaterThan(0);

            p = new Parser('Ad6');
            const parsed2 = p.parse();
            expect(parsed2.errs.length).toBeGreaterThan(0);
        })
    })

    describe('basic dice parsing', () => {
        it('handles single die expressions of any number of sides', async () => {
            const sidesToTest = [2,4,6,8,10,12,20,52,74,89,100];
            
            expect.assertions(7 * sidesToTest.length);

            for (let sides of sidesToTest) {
                p = new Parser(`1d${sides}`);
                const parsed = p.parse();
                expect(parsed.errs.length).toEqual(0);
                expect(parsed.ast).not.toBe(null);
                const res = await int.interpret(parsed.ast!);
                expect(res as RollResult).toBeDefined();
                const rr = res as RollResult;
                expect(rr.raw.length).toEqual(1);
                expect(rr.total).toEqual(rr.raw[0]);
                expect(rr.raw[0]).toBeGreaterThan(0);
                expect(rr.raw[0]).toBeLessThanOrEqual(sides);
            }
        })

        it('handles multi-die expressions of up to the maximum number of dice', async () => {
            const diceToTest = [2,3,4,5,99,9999];

            // We need an assertion per diceToTest and also 2 times the total dice to test, as we 
            // have to check that each result is within the range of sides.
            expect.assertions((5 * diceToTest.length) + (2 * diceToTest.reduce((c, t) => t + c)));

            for (let dice of diceToTest) {
                p = new Parser(`${dice}d6`);
                const parsed = p.parse();
                expect(parsed.errs.length).toEqual(0);
                expect(parsed.ast).not.toBe(null);
                const res = await int.interpret(parsed.ast!);
                expect(res as RollResult).toBeDefined();
                const rr = res as RollResult;
                expect(rr.raw.length).toEqual(dice);
                expect(rr.total).toEqual(rr.raw.reduce((c, t) => t + c));
                rr.raw.forEach((n) => expect(n).toBeLessThanOrEqual(6));
                rr.raw.forEach((n) => expect(n).toBeGreaterThan(0));
            }
        })
    })

    describe('string handling', () => {
        it('converts the raw results to a human-readable string', async () => {
            p = new Parser('3d6');
            const parsed = p.parse();
            expect(parsed.errs.length).toEqual(0);
            expect(parsed.ast).not.toBe(null);
            const res = await int.interpret(parsed.ast!);
            expect(res as RollResult).toBeDefined();
            const rr = res as RollResult;
            expect(rr.toString()).toEqual(`${rr.total} [${rr.raw[0]}, ${rr.raw[1]}, ${rr.raw[2]}]`);
        })
    })
})
