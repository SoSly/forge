import { Interpreter } from './Interpreter';
import { Parser } from './Parser';
import { LabelResult, NumberResult } from './Values'
import { inspect } from 'util';

describe('Comment Parsing and Evaluation', () => {
    let int: Interpreter;
    let p: Parser;

    beforeEach(() => {
        int = new Interpreter;
    })

    it('parses basic labels', async () => {
        p = new Parser('2 [A Label]');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res as LabelResult).toBeDefined();
        const cr = res as LabelResult;
        expect(cr.expr as NumberResult).toBeDefined();
        expect(cr.toString()).toEqual('2`A Label`');
    })

    it('parses labels as part of a complex dice expression', async () => {
        p = new Parser('2d20kh1[Advantage] + 2[Proficiency] + 2[Expertise] + 4[Dexterity]');
        const parsed = p.parse();
        expect(parsed.errs.length).toEqual(0);
        expect(parsed.ast).not.toBe(null);
        const res = await int.interpret(parsed.ast!);
        expect(res.toString()).toMatch(new RegExp('\\d{1,2} \\[\\d{1,2}, ~~\\d{1,2}~~\\]`Advantage` \\+ 2`Proficiency` \\+ 2`Expertise` \\+ 4`Dexterity` = \\d{1,2}'));
    })
})
