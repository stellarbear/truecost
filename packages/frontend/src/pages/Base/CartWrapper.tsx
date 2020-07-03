import React, {createContext, useEffect, useState} from "react";
import {gql} from "apollo-boost";
import {useQuery} from "react-apollo";
import "css/loading-animation.css";
import {SafeJSON} from "auxiliary/json";
import {sortByOrder} from "auxiliary/sort";

const GET_SHOP = gql`
    query {
        getShop
    }
`;

export type Ad = {
    [key: string]: {
        name: string;
        text: string;
        redirect: string;
        order: number;
        item: string[];
        tag: string[];
        category: string;
    };
};

export type Post = {
    [key: string]: {
        preview: string;
        name: string;
        date: number;
        url: string;
    };
};

export type Category = {
    [key: string]: {
        name: string;
        order: number;
        children: string[];
        parent: string | null;
    };
};
export type Tag = {
    [id: string]: {
        name: string;
        order: number;
        discount: number;
    };
};
export type Item = {
    [id: string]: {
        url: string;
        link: string;
        only: string;
        name: string;
        isActive: boolean;
        isTopOffer: boolean;
        price: number;
        order: number;
        discount: number;
        range: {
            from: number;
            to: number;
            price: number;
        }[];
        mark: {
            value: number;
            label: string;
        }[];
        limit: number;
        obtain: string;
        requirements: string;
        option: string[];
        tag: string[];
        category: string[];
        items: string[];
        preview: string[];
    };
};
export type Option = {
    [id: string]: {
        name: string;
        price: number;
        free: number;
        type: boolean;
        order: number;
        filter: boolean;
        area: boolean;
        item: string[];
    };
};
export type Pass = {
    [id: string]: {
        name: string;
        price: number;
        text: string;
        discount: number;
        duration: number;
        expiration: number;
        isActive: boolean;
    };
};

export class Price {
    static stringify = (key: string, list: Option) => {
        return `${list[key].price} ${list[key].type === OptionType.USD ? '$' : '%'}`;
    };
}

export class OptionType {
    static USD = true;
    static percent = false;
}

export class OptionFilter {
    static include = true;
    static exclude = false;
}

export class OptionArea {
    static local = true;
    static global = false;
}

export type CartItem = {
    [id: string]: {
        quantity: number;
        options: string[];
        range: number[];
    };
};

interface CartData {
    items: CartItem;
    options: string[];
}

export interface ICartContext {
    ready: boolean;

    payment: {
        stripe: string;
    };

    store: {
        adList: Ad;
        tagList: Tag;
        postList: Post;
        passList: Pass;
        itemList: Item;
        optionList: Option;
        categoryList: Category;
        itemUrlIdMap: Record<string, string>;
    };

    cart: {
        data: CartData;

        clear: () => void;
        removeItem: (id: string, quantity?: number) => void;
        toggleItemOption: (id: string, option: string) => void;
        addItem: (id: string, range: number[], quantity: number, options: string[]) => void;
        toggleGlobalOption: (id: string) => void;
    };

    math: {
        validateDiscount: (json: string) => ({ total: number; pass: Record<string, any> });
        applyDiscount: (price: number, discount: number) => number;
        collectDiscounts: (ownedIds: string[], purchasingIds: string[]) => ({ discount: number; price: number });

        calculateAt: (price: number, options: string[]) => number;
        calculateFor: (id: string) => number;
        calculateTotal: () => number;
        getItemPrice: (id: string, range?: number[]) => number;
        getItemPriceWithDiscount: (id: string, range?: number[]) => number;

        stringifyPrice: (option: string, item?: string | number) => string;
    };
}

const local = "cart";

const CartContext = createContext<ICartContext>({} as ICartContext);

interface ICartWrapperProps {
}

const CartWrapper: React.FC<ICartWrapperProps> = ({children}): JSX.Element => {
    const getLocal = (): CartData => SafeJSON.parse(localStorage.getItem(local), {items: {}, options: []});
    const setLocal = (data: CartData) => localStorage.setItem(local, JSON.stringify(data));
    const [cart, setCart] = React.useState<CartData>({items: {}, options: []});

    const {data, loading, called} = useQuery(GET_SHOP);
    const [ready, setReady] = useState(false);
    /*const [adList, setAdList] = React.useState<Ad>({});
    const [tagList, setTagList] = React.useState<Tag>({});
    const [itemList, setItemList] = React.useState<Item>({});
    const [passList, setPassList] = React.useState<Pass>({});
    const [optionList, setOptionList] = React.useState<Option>({});
    const [categoryList, setCategoryList] = React.useState<Category>({});*/

    const setCartAndSave = (data: CartData = ({items: {}, options: []})) => {
        setLocal(data);
        setCart(data);
    };

    //useEffect(() => {
    let stripe = "";
    let adList: Ad = {};
    let tagList: Tag = {};
    let postList: Post = {};
    let itemList: Item = {};
    let passList: Pass = {};
    let optionList: Option = {};
    let categoryList: Category = {};
    let itemUrlIdMap: Record<string, string> = {};

    if (data?.getShop) {
        const {ad, category, tag, item, option, pass, payment, post} = SafeJSON.parse(data.getShop, {
            ad: {data: {}},
            category: {data: {}},
            tag: {data: {}},
            item: {data: {}},
            option: {data: {}},
            pass: {data: {}},
            post: {data: {}},
            payment: {},
        });


        const adData = ad.data as Ad;
        const tagData = tag.data as Tag;
        const postData = post.data as Post;
        const itemData = item.data as Item;
        const passData = pass.data as Pass;
        const optionData = option.data as Option;
        const categoryData = category.data as Category;
        stripe = (payment as Record<string, string>).stripe;

        //  Parsing option binding
        const localIncludeOptionKeys = Object.keys(optionData).filter(key =>
            optionData[key].area === !!OptionArea.local && optionData[key].filter === !!OptionFilter.include);
        const localExcludeOptionKeys = Object.keys(optionData).filter(key =>
            optionData[key].area === !!OptionArea.local && optionData[key].filter === !!OptionFilter.exclude);

        for (const id in itemData) {
            localIncludeOptionKeys.filter(key => optionData[key].item.includes(id));
            itemData[id].option = ([] as string[]).concat(
                ...localIncludeOptionKeys.filter(key => optionData[key].item.includes(id)),
                ...localExcludeOptionKeys.filter(key => !optionData[key].item.includes(id)),
            );
        }

        //  Sort item options
        for (const id in itemData) {
            sortByOrder(itemData[id].option, optionData);
        }

        //  Expand range and marks
        for (const id in itemData) {
            let parsedRange = [], parsedMark = [];
            try {
                parsedRange = JSON.parse(itemData[id].range as any);
                parsedMark = JSON.parse(itemData[id].mark as any);
            } catch {
            }
            itemData[id].range = parsedRange;
            itemData[id].mark = parsedMark;
        }

        //  Set as context data
        adList = adData;
        tagList = tagData;
        postList = postData;
        itemList = itemData;
        passList = passData;
        optionList = optionData;
        categoryList = categoryData;
        itemUrlIdMap = Object.keys(itemData).reduce((acc, cur) =>
            ({...acc, [itemData[cur].url]: cur}), {});
    }

    useEffect(() => {
        if (data) {
            const cache = getLocal();
            const itemsCache = Object.keys(cache.items || {})
                .filter(key => key in itemList)
                .reduce((acc, cur) => ({...acc, [cur]: cache.items[cur]}), {});
            const optionsCache = (cache.options || [])
                .filter(key => key in optionList);

            setCartAndSave({items: itemsCache, options: optionsCache});
            setReady(true);
        }
    }, [data]);

    const clear = () => {
        setCartAndSave();
    };

    const toggleGlobalOption = (id: string) => {
        const newOptions = cart.options.includes(id) ? cart.options.filter((t: string) => t !== id) : [...cart.options, id];
        setCartAndSave({items: cart.items, options: newOptions});
    };

    const applyDiscount = (price: number, discount: number) => Math.ceil(price * (100 - discount) / 100);
    const collectDiscount = (ids: string[]) => ids
        .filter(id => id in passList && passList[id].isActive).reduce((acc, cur) => {
            const {discount, price} = passList[cur];
            acc.discount += discount;
            acc.price += price;
            return acc;
        }, ({discount: 0, price: 0}));
    const collectDiscounts = (ownedIds: string[] = [], purchasingIds: string[] = []) => {
        const {discount: od, price: op} = collectDiscount(ownedIds);
        const {discount: pd, price: pp} = collectDiscount(purchasingIds);
        return ({
            discount: od + pd,
            price: pp,
        });
    };

    const validateDiscount = (json: string) => {
        const now = new Date().getTime();
        const info = SafeJSON.parse(json, {});

        const pass = Object.keys(info).filter(key => key in passList).filter(key => passList[key].isActive)
            .reduce((acc: Record<string, number>, cur: string) => {
                if (!(cur in passList)) {
                    return acc;
                }

                const purchased = info[cur];
                const {duration, expiration} = passList[cur];

                if (expiration > 0) {
                    if (expiration > now) {
                        acc[cur] = expiration;
                    }
                }

                if (duration > 0) {
                    const durationDate = new Date(purchased);
                    durationDate.setDate(durationDate.getDate() + duration);
                    const durationExpiration = durationDate.getTime();
                    if (durationExpiration > now) {
                        acc[cur] = cur in acc ? Math.max(acc[cur], durationExpiration) : durationExpiration;
                    }
                }
                return acc;
            }, {});

        const total = Object.keys(pass).reduce((acc, cur) => acc + passList[cur].discount, 0);
        return ({pass, total});
    };

    const calcRangePrice = (at: number, range: {
        from: number;
        to: number;
        price: number;
    }[]) => {
        const minimum = range[0].from;
        const maximum = range[range.length - 1].to;

        at = at < minimum ? minimum : at;
        at = at > maximum ? maximum : at;

        let result = 0;
        for (let i = 0; i < range.length; i++) {
            const {from, to, price} = range[i];
            if (at >= from && at < to) {
                result += Math.round(price * (at - from) / (to - from));
                break;
            } else {
                result += price;
            }
        }

        return result;
    };

    const getItemPrice = (id: string, chunk: number[] = cart.items[id].range) => {
        const {price, range} = itemList[id];

        if (range.length === 0 || chunk.length === 0) {
            return price;
        } else {
            const [from, to, ...rest] = chunk;
            const toPrice = calcRangePrice(to, range);
            const fromPrice = calcRangePrice(from, range);
            const result = toPrice - fromPrice;

            return Math.max(result, price);
        }
    };

    const getItemPriceWithDiscount = (id: string, range: number[] = cart.items[id].range) => {
        const {tag, discount} = itemList[id];
        const price = getItemPrice(id, range);

        const tagDiscount = tag.reduce((acc, cur) => tagList[cur].discount > acc ? tagList[cur].discount : acc, 0);
        const itemDiscount = discount;
        const finalDiscount = Math.max(tagDiscount, itemDiscount);
        if (finalDiscount === 0) {
            return price;
        }

        let finalPrice = Math.round(price * (100 + finalDiscount) / 100);
        finalPrice = finalPrice + (10 - finalPrice % 10) % 10;

        return finalPrice;
    };

    const stringifyPrice = (option: string, item?: string | number) => {
        const price = typeof item === "string" ? itemList[item].price
            : typeof item === "number" ? item
                : Object.keys(cart.items).reduce((acc, cur) => acc + calculateFor(cur), 0);

        if (optionList[option].free === 0 || optionList[option].free > price) {
            return `${optionList[option].price} ${optionList[option].type === OptionType.USD ? '$' : '%'}`;
        } else {
            return `1 $`;
        }
    };

    const calculateAt = (price: number, options: string[], times: number = 1) => {
        return (price + options.reduce((acc, cur) => {
            switch (optionList[cur].type) {
                case OptionType.USD:
                    if (optionList[cur].free === 0 || optionList[cur].free > price) {
                        return acc + optionList[cur].price;
                    } else {
                        return acc + 1;
                    }
                case OptionType.percent:
                    if (optionList[cur].free === 0 || optionList[cur].free > price) {
                        return acc + Math.round(optionList[cur].price * (price) / 100);
                    } else {
                        return acc + 1;
                    }
                default:
                    return acc;
            }
        }, 0)) * times;
    };

    const calculateFor = (id: string) => {
        return calculateAt(getItemPrice(id), cart.items[id].options.filter((o: string) => o in optionList), cart.items[id].quantity);
    };

    const calculateTotal = () => {
        let result = 0;
        for (const item in cart.items) {
            result += calculateFor(item);
        }

        result = calculateAt(result, cart.options);

        return result;
    };

    const toggleItemOption = (id: string, option: string) => {
        if (!(option in optionList) || !(id in itemList) || !(id in cart.items)) {
            return;
        }

        const newItems = {...cart.items};
        newItems[id].options = newItems[id].options.includes(option)
            ? newItems[id].options.filter(t => t !== option)
            : [...newItems[id].options, option];

        setCartAndSave({items: newItems, options: cart.options});
    };

    const addItem = (id: string, range: number[], quantity: number, options: string[]) => {
        if (quantity < 0 || !(id in itemList) || (options.some(o => !(o in optionList)))) {
            return;
        }

        const newItems = {...cart.items};
        if (!(id in newItems)) {
            newItems[id] = {
                quantity: 0,
                options,
                range,
            };
        }

        if (newItems[id].quantity + quantity <= itemList[id].limit) {
            newItems[id].quantity += quantity;
            newItems[id].options = options;
            newItems[id].range = range;
        }

        setCartAndSave({items: newItems, options: cart.options});
    };

    const removeItem = (id: string, quantity: number = 0) => {
        if (quantity < 0) {
            return;
        }

        const newItems = {...cart.items};
        if (id in newItems) {
            newItems[id].quantity--;
            if (newItems[id].quantity === 0 || quantity === 0) {
                delete newItems[id];
            }
        }

        setCartAndSave({items: newItems, options: cart.options});
    };

    return (
        <CartContext.Provider value={{
            ready,
            store: {
                adList,
                tagList,
                postList,
                itemList,
                passList,
                optionList,
                categoryList,
                itemUrlIdMap,
            },
            payment: {
                stripe,
            },
            cart: {
                data: cart,
                addItem, removeItem, clear, toggleItemOption,
                toggleGlobalOption,
            },
            math: {
                collectDiscounts,
                validateDiscount,
                applyDiscount,

                calculateAt,
                calculateFor,
                getItemPrice,
                calculateTotal,
                stringifyPrice,
                getItemPriceWithDiscount,
            },
        }}>
            <div>
                {children}
            </div>
        </CartContext.Provider>
    );
};

export {CartWrapper, CartContext};
