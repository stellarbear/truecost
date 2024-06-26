import {IItem, IRangeData, IOption, OptionType, ICurrency} from "..";

export interface CalcResult {
    value: number;
    string: string;
    description?: string;
}

export class CalcPrice {
    private constructor(private readonly price: number = 0) { }

    static round = (val: number) =>
        Math.floor(val);
        //Math.round((val + Number.EPSILON) * 10) / 10;

    private static sum(...nums: number[]): number {
        const total = nums.reduce((acc, cur) => acc + cur, 0);

        return CalcPrice.round(total);
    }

    static applyCurrency = (price: number, currency: ICurrency) => {
        const adjustedPrice = price * currency.val;

        return CalcPrice.round(Math.max(adjustedPrice, 0));
    };

    static percentage(from: number, value: number): number {
        const delta = from * value / 100;

        return CalcPrice.round(delta);
    }

    private static applyRange(item: IItem, chunk: [number, number], min: number) {
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

        //  Override
        return Math.max((rangeTo(item, chunk[1]) - rangeTo(item, chunk[0])), min);
    }

    static fromItem(
        item: IItem,
        currency: ICurrency,
        chunk: [number, number] = [0, 0],
    ): CalcResult {
        const {price} = item;
        const adjustedPrice = price * currency.val;

        const value = (item.range.d.length > 0)
            ? CalcPrice.applyCurrency(
                CalcPrice.applyRange(item, chunk, adjustedPrice),
                currency,
            ) : adjustedPrice;
        const string = `${value} ${currency.label}`;

        return ({
            value: CalcPrice.round(value),
            string,
        });
    }

    static fromOption(
        item: CalcResult,
        currency: ICurrency,
        option: IOption,
    ): CalcResult {
        const {price, type, free} = option;
        const adjustedFree = free * currency.val;
        const adjustedPrice = price * currency.val;

        const value = (item.value >= adjustedFree && adjustedFree > 0)
            ? 1
            : type === OptionType.RELATIVE
                ? this.percentage(item.value, price)
                : adjustedPrice;

        const string = `${value} ${currency.label}`;
        const description = type === OptionType.RELATIVE ? `${price} %` : undefined;

        return ({
            value: CalcPrice.round(value),
            string,
            description,
        });
    }

    static fromItemAndOptions(
        item: CalcResult,
        currency: ICurrency,
        options: IOption[],
    ): CalcResult {
        const value = this.sum(item.value, ...options.map(o => CalcPrice.fromOption(item, currency, o).value));
        const string = `${value} ${currency.label}`;

        return ({
            value: CalcPrice.round(Math.max(value, 0)),
            string,
        });
    }
}