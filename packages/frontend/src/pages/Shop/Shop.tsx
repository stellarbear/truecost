import React, {CSSProperties, useContext, useEffect, useState} from "react";

import {NotificationContext} from "components/wrappers";
import {DataContext, useStore} from "pages/Data/Wrapper";
import {IShop} from "pages/Data/useData";
import {Chip, Grid, TextField, Paper, Container} from "@material-ui/core";
import {dictSort, dictSortMap} from "auxiliary/sort";
import {Autocomplete} from "@material-ui/lab";
import {SafeJSON} from "auxiliary/json";
import {useStorage} from "auxiliary/useStorage";
import {Col, Row, RowGrid} from "pages/Base/Grid";
import {ArraySlice} from "components/generic/components/ArraySlice";
import ItemCard from "./ItemCard";
import {InfoCard} from "pages/Base/InfoCard";

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


const Shop: React.FC = () => {
    const {current: {shop}} = useStore();

    const {tags, options, items}: IShop = shop();
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
        .filter(itemId =>
            state.names.length === 0 ? true
                : state.names.includes(itemId) || (items.id[itemId].item.length > 0 && items.id[itemId].item.some(i => state.names.includes(i))))
        .filter(itemId => state.tags.length === 0 ? true :
            items.id[itemId].tag.some(t => state.tags.includes(t)));

    const renderMock = () => (
        <InfoCard text={[
            'Unfortunately, nothing was found',
            'Try next time or change some filters'
        ]} />
    )

    const renderItems = (data: string[]) => (
        <ArraySlice data={data}>
            {(itemIds => (
                <RowGrid w={250} s={16} p={16}>
                    {itemIds.map(id => (
                        <ItemCard key={id} id={id} />
                    ))}
                </RowGrid>
            ))}
        </ArraySlice>
    )

    const filterData = () => {
        const data = filterItems();
        return (
            (data.length === 0)
                ? renderMock()
                : renderItems(data)
        )
    }

    const filterNames = () => (
        <Autocomplete
            multiple

            value={state.names}
            onChange={(_: any, names: string[]) => onStateChange('names', names)}

            options={Object.keys(items.id)}
            //groupBy={(itemId) => items.id[itemId].name.charAt(0)}
            getOptionLabel={(itemId) => items.id[itemId].name}
            renderInput={(params) => <TextField {...params} label="Search by name" variant="outlined" />}
        />
    )

    const filterTags = () => Object.keys(tags.id).length > 0 && (
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
        <Container fixed>
            <Col fullWidth s={16}>
                {filterNames()}
                {filterTags()}
                {filterData()}
            </Col>
        </Container>
    );
};

export default Shop;
