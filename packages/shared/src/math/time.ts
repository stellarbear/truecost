import {IItem, IRangeData} from "../interfaces";

export class Time {
    private constructor(private readonly time: number = 0) {}
    public static zero = () => new Time(0);

    private static applyRange(item: IItem, chunk: [number, number]) {
        const rangeChunk = (from: IRangeData, to: IRangeData, at: number) => {
            at = Math.max(Math.min(at, to.a), from.a);

            const all = from.e || 0;
            const percentage = (at - from.a) / (to.a - from.a);
            return Math.round(all * percentage);
        }
        const rangeTo = (item: IItem, to: number) => {
            const {range} = item;
            to = Math.min(to, (range.d[range.d.length - 1].a));

            let total = 0;
            for (let i = 1; i < range.d.length; i++) {
                total += rangeChunk(range.d[i - 1], range.d[i], to);
            }

            return total;
        }

        return Math.max((rangeTo(item, chunk[1]) - rangeTo(item, chunk[0])), item.eta)
    }

    static fromItem(item: IItem, chunk: [number, number] = [0, 0]) {
        const {eta} = item;

        if (item.range.d.length > 0) {
            return new Time(Time.applyRange(item, chunk));
        } else {
            return new Time(eta);
        }
    }
    
    add(time: number): Time
    add(time: Time): Time
    add(time: Time | number): Time {
        if (typeof time == "number") {
            return new Time(this.toValueClear + time)
        } else if (time instanceof Time) {
            return new Time(this.toValueClear + time.toValueClear)
        }

        return this;
    }

    multiply(value: number): Time {
        return new Time(this.toValueClear * value)
    }

    percentage(value: number): Time {
        value = Math.max(Math.min(100, Math.round(value)), 0);
        let delta = Math.round(this.toValueClear * (value) / 100);

        return new Time(delta)
    }

    private get toValueClear() {
        return this.time;
    }

    get toValue() {
        return this.time > 0 ? Math.round(this.time) : 1;
    }

    get toString() {
        const value = this.toValue;
        if (value < 60) {
            return `${value} min.`
        } else if (value < 60 * 24) {
            return `${Math.floor(value / 60)} h. ${value % 60 > 0 ? ` ${value % 60} min.` : ""}`
        } else {
            return `${Math.floor(value / (24 * 60))} d.`
        }
    }
}