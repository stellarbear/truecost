import React, {CSSProperties, useContext, useEffect, useState} from "react";

import {Storage} from "auxiliary/storage";
import {NotificationContext} from "components/wrappers";
import {IShop, DataContext} from "pages/Data/Wrapper";
import Pagination from "pages/Base/Pagination";


export interface ShopState {
    category: string;
    items: string[];
    tags: string[];
    sort: {
        field: string;
        order: "asc" | "desc";
    };
}

export const defaultState: ShopState = {
    category: "",
    items: [],
    tags: [],
    sort: {
        field: "default",
        order: "asc",
    },
};

const Shop: React.FC = () => {
    const {
        store: {
            shop: {current}
        },
    } = useContext(DataContext);
    const {notify} = React.useContext(NotificationContext);


    const {tag, option, item: {id: items}, category}: IShop = current();
    const [state, setState] = useState<ShopState>(defaultState);
    //const [scroll, setScroll] = useState<number>(Storage.getItem(storageScrollPersistKey, 0));

    /*
    const filteredItems = Object.keys(itemList)
        .filter(key => itemList[key].isActive)
        .filter(key => itemList[key].only.length === 0);
*/
    const renderItems = () => {
        return <Pagination ids={Object.keys(items)} />
    }

    return (
        <React.Fragment>
            {renderItems()}
        </React.Fragment>
    );
};

export default Shop;
