export default class Timer {
    timer = [];
    end = [];

    constructor() {
        this.timer = process.hrtime();
        return this;
    }

    stop() {
        this.end = process.hrtime(this.timer);
        return this;
    }

    format() {
        if (this.end[0] > 0) return `${this.end[0]}s`;
        return `${Math.floor(this.end[1] / 1e6)}ms`;
    }
}
