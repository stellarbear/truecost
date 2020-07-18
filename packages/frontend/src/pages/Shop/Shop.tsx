import React, {CSSProperties, useContext, useEffect, useState} from "react";

import {NotificationContext} from "components/wrappers";
import {DataContext} from "pages/Data/Wrapper";
import {IShop} from "pages/Data/useData";
import {Chip, Grid, TextField, Paper, Container} from "@material-ui/core";
import {dictSort, dictSortMap} from "auxiliary/sort";
import {Autocomplete} from "@material-ui/lab";
import {SafeJSON} from "auxiliary/json";
import {useStorage} from "pages/Data/useStorage";
import {Col, Row} from "pages/Base/Grid";
import {ItemList} from "./ItemList";

const empty = "default";

export interface IShopState {
    names: string[];
    tags: string[];
    sort: string;
    order: "asc" | "desc";
}

export const defaultState: IShopState = {
    names: [],
    tags: [],
    sort: empty,
    order: "asc",
};

const key = "shop"
const Shop: React.FC = () => {
    const {current: {shop}} = useContext(DataContext);
    const {notify} = React.useContext(NotificationContext);


    const {tags, options, items}: IShop = shop()!;
    const [state, setState] = useStorage<IShopState>('shop', defaultState, (state) => ({...defaultState, ...state}));


    const onStateChange = (field: keyof IShopState, id: string | string[]) => {
        let value = state[field];
        if (typeof state[field] == "string" && typeof id === "string") {
            value = state[field] === id ? empty : id;
        } else if (state[field] instanceof Array && typeof id === "string") {
            const filtered = (state[field] as string[]).filter(e => e !== id);
            value = filtered.length === state[field].length ? [...filtered, id] : filtered
        } else if (state[field] instanceof Array && id instanceof Array) {
            value = id;
        }

        setState({...state, [field]: value});
    }

    const filterItems = () => Object.keys(items.id)
        .filter(itemId => state.names.length === 0 ? true : state.names.includes(itemId))
        .filter(itemId => state.tags.length === 0 ? true :
            items.id[itemId].tag.map(t => t.id).some(t => state.tags.includes(t)));


    const renderItems = () => {
        return <ItemList ids={filterItems()} />
    }

    const filterNames = () => (
        <Autocomplete
            multiple

            value={state.names}
            onChange={(_: any, names: string[]) => onStateChange('names', names)}

            options={Object.keys(items.id)}
            groupBy={(option) => option.charAt(0)}
            getOptionLabel={(itemId) => items.id[itemId].name}
            renderInput={(params) => <TextField {...params} label="Search by name" variant="outlined" />}
        />
    )

    const filterTags = () => (
        <Paper>
            <Row start p={8} s={8}>
                {Object.keys(tags.id).map(tagId => (
                    <Chip
                        key={tagId}
                        label={tags.id[tagId].name}
                        clickable
                        onClick={() => onStateChange('tags', tagId)}
                        color={state.tags.includes(tagId) ? "primary" : undefined}
                    />
                ))}
            </Row>
        </Paper>
    )

    return (
        <Container maxWidth="md">
            <Col fullWidth s={16}>
                {filterNames()}
                {filterTags()}
                {renderItems()}
            </Col>
        </Container>
    );
};

export default Shop;