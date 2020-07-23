import {IItem, IRange, IOption} from "../interfaces";
import {OptionType} from "../enums";

export interface IBooking {
    item: IItem,
    chunk?: [number, number],
    quantity?: number,
    options: IOption[]
}

export class Price {
    private constructor(private readonly price: number = 0) {
    }

    private static applyRange(item: IItem, chunk: [number, number]) {
        const rangeChunk = (from: IRange, to: IRange, at: number) => {
            at = Math.max(Math.min(at, to.at), from.at);

            const all = from.price;
            const percentage = (at - from.at) / (to.at - from.at)
            return Math.round(all * percentage);
        }
        const rangeTo = (item: IItem, to: number) => {
            const {range} = item;
            to = Math.min(to, range[range.length - 1].at);

            let total = 0;
            for (let i = 1; i < range.length; i++) {
                total += rangeChunk(range[i - 1], range[i], to);
            }

            return total;
        }

        return (rangeTo(item, chunk[1]) - rangeTo(item, chunk[0])) || item.range[0].price
    }

    static fromItem(item: IItem, chunk: [number, number] = [0, 0]) {
        const {price} = item;
        if (item.range.length > 0) {
            return new Price(Price.applyRange(item, chunk));
        } else {
            return new Price(price);
        }
    }

    static fromBooking({
                           item,
                           chunk,
                           quantity = 1,
                           options = []
                       }: IBooking) {
        const base = Price.fromItem(item, chunk);

        return base.multiply(quantity).add(base.withOption(options))
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
        value = Math.max(Math.min(100, Math.round(value)), -100);
        let delta = Math.round(this.toValue * value / 100);

        return new Price(delta)
    }

    getOption(option: IOption): Price {
        let base = this.toValue;

        let {price, type, free} = option;
        if (base >= free) {
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
