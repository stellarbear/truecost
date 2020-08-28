import {Dict, IShop} from ".";

export interface ICartItem {
    itemId: string;
    quantity: number;
    optionIds: string[];
    chunk?: [number, number];
}

export interface ICart {
    local: Dict<ICartItem>;
    global: string[];
}

export const parseCart = (shop: IShop, json: any) => {
    const result: ICart = {global: [], local: {}};
    try {
        const game = shop;

        if (typeof json === "object" && "local" in json && "global" in json) {
            for (const jsonItemId in json.local) {

                const {quantity, itemId, optionIds} = json.local[jsonItemId];

                if ((quantity && quantity > 0 && Math.round(quantity) === quantity) &&

                    (itemId &&
                        itemId === jsonItemId &&
                        itemId in game.items.id &&
                        game.items.id[itemId].active) &&

                    (optionIds &&
                        Array.isArray(optionIds) &&
                        !optionIds.some(o => !(o in game.options.local.id)) &&
                        !optionIds.some(o => !game.options.local.id[o].active))
                ) {
                    result.local[itemId] = json.local[itemId];
                }
            }

            const optionIds = json.global;
            if (optionIds &&
                Array.isArray(optionIds) &&
                !optionIds.some(o => !(o in game.options.global.id)) &&
                !optionIds.some(o => !game.options.global.id[o].active)) {
                result.global = json.global;
            }
        }
    } catch {
    }

    return result;
};
