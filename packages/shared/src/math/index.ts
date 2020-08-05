import {IItem, IOption, IRangeData} from "../interfaces";
import {OptionType} from "../enums";

export class Price {
    private constructor(private readonly price: number = 0) {}
    public static zero = () => new Price(0);
    public static total(data: {
        item: IItem,
        chunk?: [number, number],
        options: IOption[],
        quantity: number
    }[]) {
        let result = Price.zero();

        for (let {item, chunk, options, quantity} of data) {
            const base = Price.fromItem(item, chunk);
            const all = base.withOption(options);

            result = result.add(all.multiply(quantity));
        }

        return result;
    }

    private static applyRange(item: IItem, chunk: [number, number]) {
        const rangeChunk = (from: IRangeData, to: IRangeData, at: number) => {
            at = Math.max(Math.min(at, to.a), from.a);

            const all = from.p;
            const percentage = (at - from.a) / (to.a - from.a);
            return Math.round(all * percentage);
        }
        const rangeTo = (item: IItem, to: number) => {
            const {range} = item;
            to = Math.min(to, range.d[range.d.length - 1].a);

            let total = 0;
            for (let i = 1; i < range.d.length; i++) {
                total += rangeChunk(range.d[i - 1], range.d[i], to);
            }

            return total;
        }

        return Math.max((rangeTo(item, chunk[1]) - rangeTo(item, chunk[0])), item.price)
    }

    static fromItem(item: IItem, chunk: [number, number] = [0, 0]) {
        const {price} = item;
        
        if (item.range.d.length > 0) {
            return new Price(Price.applyRange(item, chunk));
        } else {
            return new Price(price);
        }
    }

    add(price: number): Price
    add(price: Price): Price
    add(price: Price | number): Price {
        if (typeof price == "number") {
            return new Price(this.toValue + price)
        } else if (price instanceof Price) {
            return new Price(this.toValue + price.toValue)
        }

        return this;
    }

    multiply(value: number): Price {
        return new Price(this.toValue * value)
    }

    percentage(value: number): Price {
        value = Math.max(Math.min(100, Math.round(value)), 0);
        let delta = Math.round(this.toValue * (value) / 100);

        return new Price(delta)
    }

    getOption(option: IOption): Price {
        let base = this.toValue;

        let {price, type, free} = option;
        if (base >= free && free > 0) {
            return new Price();
        }

        return type === OptionType.NOMINAL ? new Price(price)
            : type === OptionType.RELATIVE ? this.percentage(price)
                : new Price();
    }

    withOption(input: IOption[] | IOption): Price {
        const options = Array.isArray(input) ? input : [input];
        let base = this;
        let result = new Price(this.toValue);

        for (let option of options) {
            result = result.add(base.getOption(option));
        }

        return result;
    }

    get toValue() {
        return this.price > 0 ? Math.ceil(this.price) : 1;
    }

    get toString() {
        return `${this.toValue} $`;
    }
}
