import React, {CSSProperties, useContext, useEffect, useState} from "react";

import {NotificationContext} from "components/wrappers";
import {DataContext, useStore} from "pages/Data/Wrapper";
import {Chip, Grid, TextField, Paper, Container, Button} from "@material-ui/core";
import {dictSort, dictSortMap} from "auxiliary/sort";
import {Autocomplete, createFilterOptions} from "@material-ui/lab";
import {SafeJSON} from "auxiliary/json";
import {useStorage} from "auxiliary/useStorage";
import {Col, Row, RowGrid} from "pages/Base/Grid";
import {ArraySlice} from "components/generic/components/ArraySlice";
import ItemCard from "./ItemCard";
import {InfoCard} from "pages/Base/InfoCard";
import {useNotification} from "components/wrappers/NotifyWrapper";
import {AutoCompleteCustom} from "components/AutoCompleteCustom";

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

declare var Tawk_API: any

const Shop: React.FC = () => {
    const {notify} = useNotification();
    const {current: {shop}} = useStore();

    const {tags, options, items} = shop();
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

    const filterItems = () => dictSort(items.id)
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
        debugger;
        const data = filterItems();
        return (
            (data.length === 0)
                ? renderMock()
                : renderItems(data)
        )
    }

    const filterNames = () => (
        <AutoCompleteCustom
            values={state.names}
            options={Object.keys(items.id)}
            onChange={(values => onStateChange('names', values.map((v: any) => v.id)))}
            onCustom={() => {
                Tawk_API?.maximize()
                notify("Ask us for the custom order, we will serve it to you!")
            }}
            getLabel={(itemId) => items.id[itemId].name}
        />
    )

    const filterTags = () => Object.keys(tags.id).length > 0 && (
        <Paper>
            <Row start p={8} s={8}>
                {dictSort(tags.id).map(tagId => (
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
