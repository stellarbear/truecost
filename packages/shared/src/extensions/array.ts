export {};

declare global {
    interface Array<T> {
        first(): T;
        last(): T;
    }
}

Array.prototype.first = function () {
    return this.length > 0 ? this[0] : undefined;
}

Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : undefined;
}