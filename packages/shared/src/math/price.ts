import {IItem, IOption, IRangeData} from "../interfaces";
import {OptionType} from "../enums";

export class Price {
    private constructor(private readonly price: number = 0) {
    }

    get toValue() {
        return this.price > 0 ? Math.round(this.price) : 1;
    }

    get toString() {
        return `${this.toValue} $`;
    }

    private get toValueClear() {
        return this.price;
    }

    public static zero = () => new Price(0);

    static fromItem(item: IItem, chunk: [number, number] = [0, 0]) {
        const {price} = item;

        if (item.range.d.length > 0) {
            return new Price(Price.applyRange(item, chunk));
        } else {
            return new Price(price);
        }
    }

    private static applyRange(item: IItem, chunk: [number, number]) {
        const rangeChunk = (from: IRangeData, to: IRangeData, at: number) => {
            at = Math.max(Math.min(at, to.a), from.a);

            const all = from.p;
            const percentage = (at - from.a) / (to.a - from.a);
            return Math.round(all * percentage);
        };
        const rangeTo = (item: IItem, to: number) => {
            const {range} = item;
            to = Math.min(to, range.d[range.d.length - 1].a);

            let total = 0;
            for (let i = 1; i < range.d.length; i++) {
                total += rangeChunk(range.d[i - 1], range.d[i], to);
            }

            return total;
        };

        return Math.max((rangeTo(item, chunk[1]) - rangeTo(item, chunk[0])), item.price);
    }

    add(price: number): Price

    add(price: Price): Price

    add(price: Price | number): Price {
        if (typeof price == "number") {
            return new Price(this.toValueClear + price);
        } else if (price instanceof Price) {
            return new Price(this.toValueClear + price.toValueClear);
        }

        return this;
    }

    multiply(value: number): Price {
        return new Price(this.toValueClear * value);
    }

    percentage(value: number): Price {
        value = Math.max(Math.min(100, Math.round(value)), 0);
        const delta = Math.round(this.toValueClear * (value) / 100);

        return new Price(delta);
    }

    getOption(option: IOption): Price {
        const base = this.toValueClear;

        const {price, type, free} = option;
        if (base >= free && free > 0) {
            return new Price(1);
        }

        return type === OptionType.NOMINAL ? new Price(price)
            : type === OptionType.RELATIVE ? this.percentage(price)
                : new Price(1);
    }

    withOption(input: IOption[] | IOption): Price {
        const options = Array.isArray(input) ? input : [input];
        const base = new Price(this.toValueClear);
        let result = new Price(this.toValueClear);

        for (const option of options) {
            result = result.add(base.getOption(option));
        }

        return result;
    }
}
