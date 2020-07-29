import {useStorage} from "auxiliary/useStorage"
import {Dict, IShopContext, IShop} from "./useData"

export interface ICartRemove {
    itemId: string
}

export interface ICartUpsert extends ICartRemove {
    quantity: number
    optionIds: string[]
    chunk?: [number, number]
}

export interface ICartItem extends ICartUpsert {}

export type ICart = Dict<ICartItem>
export type ICartContext = Dict<ICart>

const baseCart = (shop: IShopContext): ICartContext => {
    const result: ICartContext = {};
    for (let key in shop.data) {
        result[key] = {};
    }

    return result;
}

const validateCart = (shop: IShopContext, json: any) => {
    if (typeof json !== "object") {
        return baseCart(shop);
    }

    const result: ICartContext = {...baseCart(shop)}
    for (let jsonGameId in json) {
        if (jsonGameId in shop.data) {
            const game = shop.data[jsonGameId];

            if (typeof json[jsonGameId] === "object") {
                for (let jsonItemId in json[jsonGameId]) {
                    const {quantity, itemId, optionIds} = json[jsonGameId][jsonItemId];

                    if ((quantity && quantity > 0 && Math.round(quantity) === quantity) &&
                        (itemId && itemId === jsonItemId && itemId in game.items.id) &&
                        (optionIds && Array.isArray(optionIds) && !optionIds.some(o => !(o in game.options.local.id)))
                    ) {
                        result[jsonGameId][itemId] = json[jsonGameId][itemId];
                    }
                }
            }
        }
    }

    return result;
}


export const useCart = (shop: IShopContext) => {
    const [cart, setCart] = useStorage<ICartContext>('cart', baseCart(shop), (json) => validateCart(shop, json))

    const itemUpsert = (gameId: string, {itemId, optionIds, chunk, quantity}: ICartUpsert) => {
        const gameCart = {...cart[gameId]};
        gameCart[itemId] = {
            itemId,
            chunk,
            optionIds,
            quantity: cart[gameId][itemId] ? gameCart[itemId].quantity + quantity : quantity,
        }

        if (cart[gameId][itemId] && gameCart[itemId].quantity <= 0) {
            delete gameCart[itemId];
        }

        setCart({...cart, [gameId]: gameCart})
    }

    const itemRemove = (gameId: string, {itemId}: ICartRemove) => {
        const gameCart = {...cart[gameId]};
        delete gameCart[itemId];
        setCart({...cart, [gameId]: gameCart})
    }

    const cartWipe = (gameId: string) => {
        setCart({...cart, [gameId]: {}})
    }

    return {cart, itemUpsert, itemRemove, cartWipe};
}