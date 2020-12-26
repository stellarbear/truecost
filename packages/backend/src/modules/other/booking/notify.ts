import {ICurrency} from "@truecost/shared";
import {slack} from "../../../helpers/slack";
import {IItemShape} from "./helpers";

export const notify = (
    info: string,
    items: IItemShape[],
    currency: ICurrency,
    email: string,
    method: string,
    total: number,
    coupon?: string,
) => {
    slack([
        "[purchase attempt]",
        coupon || "-",
        currency.id,
        method,
        email,
        '--------',
        `total: ${total} ${currency.label}`,
        '--------',
        JSON.stringify(items.map(i => ({name: i.name, desc: i.description}))),
        '--------',
        info,
    ]);
};