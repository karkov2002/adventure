export class IdGenerator {
    constructor() {
        this.counter = 0;
    }

    generate() {
        this.counter++;
        return this.counter.toString().padStart(10, '0');
    }

    setCounter(value) {
        this.counter = value;
    }

    getCounter() {
        return this.counter;
    }
}