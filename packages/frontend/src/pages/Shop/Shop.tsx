import React from "react";
import {useStore} from "pages/Data/Wrapper";
import {Chip, Container, Divider, NoSsr, Paper, Typography} from "@material-ui/core";
import {dictSort} from "@truecost/shared";
import {useStorage} from "auxiliary/useStorage";
import {Col, Row, RowGrid} from "pages/Base/Grid";
import {ArraySlice} from "components/generic/components/ArraySlice";
import ItemCard from "./ItemCard";
import {InfoCard} from "pages/Base/InfoCard";
import {useNotification} from "components/wrappers/NotifyWrapper";
import {AutoCompleteCustom} from "components/AutoCompleteCustom";
import {Meta} from "pages/Base/Meta";

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

declare let Tawk_API: any;

const Shop: React.FC = () => {
    const {notify} = useNotification();
    const {current: {shop, game}} = useStore();

    const {tags, items} = shop();
    const itemIds = dictSort(items.id).filter(t => !items.id[t].direct);
    const tagIds = Object.keys(tags.id);

    const [state, setState] = useStorage<IShopState>('shop', defaultState, (state) => {
        const result = {...defaultState, ...state};

        result.tags = result.tags.filter(n => tagIds.includes(n));
        result.names = result.names.filter(n => itemIds.includes(n));

        return result;
    });
    const tagDeps = state.tags.length > 0 ? shop().getTagDeps(state.tags[state.tags.length - 1]) : [];

    //  TODO: make readale
    const filterItems = () => itemIds
        .filter(itemId =>
            state.names.length === 0 ? true
                : (state.names.includes(itemId) ||
                    (items.id[itemId].item.length > 0 && items.id[itemId].item.some(i => state.names.includes(i)))))
        .filter(itemId => state.tags.length === 0 ? true :
            items.id[itemId].tag.some(t => tagDeps.includes(t)));

    const renderMock = () => (
        <InfoCard text={[
            'Unfortunately, nothing was found',
            'Try next time or change some filters',
        ]} />
    );

    const renderItems = (data: string[]) => (
        <ArraySlice data={data} prefix="shop-pagination" scroll={300} chunk={24}>
            {(itemIds => (
                <RowGrid w={250} s={16} p={16}>
                    {itemIds.map(id => (
                        <ItemCard key={id} id={id} />
                    ))}
                </RowGrid>
            ))}
        </ArraySlice>
    );

    const filterData = () => {
        const data = filterItems();
        return (
            (data.length === 0)
                ? renderMock()
                : renderItems(data)
        );
    };

    const filterNames = () => (
        <NoSsr>
            <AutoCompleteCustom
                values={state.names}
                options={itemIds}
                onChange={names =>
                    setState({
                        ...state,
                        tags: [],
                        names,
                    })
                }
                onCustom={() => {
                    Tawk_API?.maximize();
                    notify("Ask us for the custom order, we will serve it to you!");
                }}
                getLabel={(itemId) => itemId in items.id ? items.id[itemId].name : "unknown"}
            />
        </NoSsr>
    );

    const tag = (tagId: string, depth = 0) => (
        <Chip
            style={{marginBottom: 4}}
            key={tagId}
            label={tags.id[tagId].name}
            clickable
            onClick={() => {
                const index = state.tags.indexOf(tagId);

                setState({
                    ...state,
                    tags: index === -1
                        ? [...state.tags.slice(0, depth), tagId]
                        : state.tags.slice(0, index),
                });
            }}
            color={state.tags.includes(tagId) ? "primary" : undefined}
        />
    );

    const filterTags = () => Object.keys(tags.base).length > 0 && (
        <Paper>
            <Col p={8}>
                <Row p={[2, 8]} s={8} wrap>
                    {dictSort(tags.id, tags.base).map(tagId => tag(tagId))}
                </Row>
                {state.tags.map((tagId, index) => tags.id[tagId].children.length > 0 && (
                    <Col s={4} p={[0, 8]} key={tagId}>
                        <Typography variant="body2">{`${tags.id[tagId].name}: `}</Typography>
                        <Divider />
                        <Row p={[2, 0]} s={8} wrap>
                            {dictSort(tags.id, tags.id[tagId].children).map(tagId => tag(tagId, index + 1))}
                        </Row>
                    </Col>
                ))}
            </Col>
        </Paper>
    );

    return (
        <>
            <Meta entity={game} />
            <Container fixed style={{padding: 0}}>
                <Col s={16}>
                    {filterNames()}
                    {filterTags()}
                    {filterData()}
                </Col>
            </Container>
        </>
    );
};

export default Shop;
