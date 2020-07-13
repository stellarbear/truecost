import React, {CSSProperties, useContext, useEffect, useState} from "react";

import {Storage} from "auxiliary/storage";
import {NotificationContext} from "components/wrappers";
import {DataContext} from "pages/Data/Wrapper";
import Pagination from "./Pagination";
import {IShop} from "pages/Data/useData";
import {Chip, Grid, TextField} from "@material-ui/core";
import {dictSort, dictSortMap} from "auxiliary/sort";
import {Autocomplete} from "@material-ui/lab";

const empty = "default";

export interface IShopState {
    category: string;
    items: string[];
    tags: string[];
    sort: string;
    order: "asc" | "desc";
}

export const defaultState: IShopState = {
    category: empty,
    items: [],
    tags: [],
    sort: empty,
    order: "asc",
};

const Shop: React.FC = () => {
    const {current: {shop}} = useContext(DataContext);
    const {notify} = React.useContext(NotificationContext);


    const {tags, options, items, categories}: IShop = shop()!;
    const [state, setState] = useState<IShopState>(defaultState);

    const onStateChange = (field: keyof IShopState, id: string) => {
        if (typeof state[field] == "string") {
            setState({...state, [field]: state[field] === id ? empty : id})
        } else if (state[field] instanceof Array) {
            const filtered = (state[field] as string[]).filter(e => e !== id);
            setState({...state, [field]: filtered.length == state[field].length ? [...filtered, id] : filtered})
        }
    }
    //const [scroll, setScroll] = useState<number>(Storage.getItem(storageScrollPersistKey, 0));

    /*
    const filteredItems = Object.keys(itemList)
        .filter(key => itemList[key].isActive)
        .filter(key => itemList[key].only.length === 0);
*/
    const renderItems = () => {
        return <Pagination ids={Object.keys(items.id)} />
    }

    const renderTags = () => {
        /*const tags = dictSortMap(tags.id);

        if (tags.length === 0) {
            return null
        }

        return (
            <Autocomplete
                id="tags"
                options={tags}
                getOptionLabel={(tag) => tag.name}
                //style={{width: 300}}
                renderInput={(params) => <TextField {...params} label="Tag list" variant="outlined" />}
            />
		)*/
    }
    const renderCategory = () => {
        //const categories = dictSortMap(category.id);
/*
        if (tags.length === 0) {
            return null
        }

        return (
            <Autocomplete
                id="tags"
                options={tags}
                getOptionLabel={(tag) => tag.name}
                //style={{width: 300}}
                renderInput={(params) => <TextField {...params} label="Tag list" variant="outlined" />}
            />
		)*/
    }

    return (
        <React.Fragment>
            {renderTags()}
            {renderItems()}
        </React.Fragment>
    );
};

export default Shop;
