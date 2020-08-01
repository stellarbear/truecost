import {useStorage} from "auxiliary/useStorage"
import {Dict, IShopContext, parseCart, ICart} from "@truecost/shared";

export interface ICartRemove {
    itemId: string
}

export interface ICartUpsert extends Partial<ICartRemove> {
    quantity: number
    optionIds: string[]
    chunk?: [number, number]
}

export type ICartContext = Dict<ICart>

const baseCart = (shop: IShopContext): ICartContext => {
    const result: ICartContext = {};
    for (let key in shop.data) {
        result[key] = {local: {}, global: []};
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
            result[jsonGameId] = parseCart(shop.data[jsonGameId], json[jsonGameId]);
        }
    }

    return result;
}


export const useCart = (shop: IShopContext) => {
    const [cart, setCart] = useStorage<ICartContext>('cart', baseCart(shop), (json) => validateCart(shop, json))

    const itemUpsert = (gameId: string, data: ICartUpsert) => {
        const gameCart = {...cart[gameId]};
        const {itemId, optionIds} = data;

        if (itemId) {
            const {chunk, quantity} = data;

            gameCart.local[itemId] = {
                itemId,
                chunk,
                optionIds,
                quantity: cart[gameId].local[itemId] ? gameCart.local[itemId].quantity + quantity : quantity,
            }

            if (cart[gameId].local[itemId] && gameCart.local[itemId].quantity <= 0) {
                delete gameCart.local[itemId];
            }
        } else {
            gameCart.global = optionIds;
        }

        setCart({...cart, [gameId]: gameCart})
    }

    const itemRemove = (gameId: string, {itemId}: ICartRemove) => {
        const gameCart = {...cart[gameId]};
        delete gameCart.local[itemId];
        setCart({...cart, [gameId]: gameCart})
    }

    const cartWipe = (gameId: string) => {
        setCart({...cart, [gameId]: {local: {}, global: []}})
    }

    const cartCount = (gameId: string) => {
        const gameCart = {...cart[gameId]}.local;

        return Object.keys(gameCart)
            .reduce((acc, cur) => acc + gameCart[cur].quantity, 0);
    }

    return {cart, itemUpsert, itemRemove, cartWipe, cartCount};
}