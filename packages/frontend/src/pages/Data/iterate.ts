import {IStore, IShop} from "./useData";
import {IOption} from "@truecost/shared";

export const iterateOptions = (shop: IShop, itemId: string): string[] => {
    const item = shop.items.id[itemId];
    const options = shop.options.local;

    const result = [];
    options.exclude.forEach(optionId => {
        if (!item.option.includes(optionId)) {
            result.push(optionId);
        }
    })

    for (let optionId of item.option) {
        if (options.include.has(optionId)) {
            result.push(optionId);
        }
    }

    return result;
}