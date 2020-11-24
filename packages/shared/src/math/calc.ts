import {IItem, IRangeData, IOption, OptionType} from "..";

export interface CalcResult {
    value: number;
    string: string;
    description?: string;
}

export class CalcPrice {
    private constructor(private readonly price: number = 0) { }

    static round = (val: number) =>
        Math.round((val + Number.EPSILON) * 100) / 100;

    private static sum(...nums: number[]): number {
        const total = nums.reduce((acc, cur) => acc + cur, 0);

        return this.round(total);
    }

    static percentage(from: number, value: number): number {
        const delta = from * value / 100;

        return this.round(delta);
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

    static fromItem(item: IItem, chunk: [number, number] = [0, 0]): CalcResult {
        const {price} = item;

        const value = (item.range.d.length > 0) ? CalcPrice.applyRange(item, chunk) : price;
        const string = `${value} $`;

        return ({
            value: Math.max(value, 0),
            string,
        });
    }

    static fromOption(item: CalcResult, option: IOption): CalcResult {
        const {price, type, free} = option;

        const value = (item.value >= free && free > 0)
            ? 0
            : type === OptionType.RELATIVE
                ? this.percentage(item.value, price)
                : price;

        const string = `${value} $`;
        const description = type === OptionType.RELATIVE ? `${price} %` : undefined;

        return ({
            value: Math.max(value, 0),
            string,
            description,
        });
    }

    static fromItemAndOptions(item: CalcResult, options: IOption[]): CalcResult {
        const value = this.sum(item.value, ...options.map(o => CalcPrice.fromOption(item, o).value));
        const string = `${value} $`;

        return ({
            value: Math.max(value, 0),
            string,
        });
    }
}