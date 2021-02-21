import {EvalFn, RollResult} from "./Values";

const MAXIMUM_DICE = 9999;
const MAXIMUM_SIDES = 999;

export function roll(dice: number, sides: number): EvalFn {
    if (dice > MAXIMUM_DICE) {
        throw new Error(`maximum number of dice exceeded by dice=${dice} maximum=${MAXIMUM_DICE}`);
    }

    if (dice < 1) {
        throw new Error(`number of dice must be at least 1 dice=${dice}`);
    }

    if (sides > MAXIMUM_SIDES) {
        throw new Error(`maximum number of sides exceeded by sides=${sides} maximum=${MAXIMUM_SIDES}`);
    }

    if (sides < 2) {
        throw new Error(`number of sides must be at least 2 sides=${sides}`);
    }

    return async () => {
        let result: number = 0;
        let raw: number[] = [];
    
        for (let i = 0; i < dice; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            raw.push(roll);
            result += roll;
        }

        return new RollResult(raw);
    }
}
