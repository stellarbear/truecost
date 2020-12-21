import React, {useMemo} from "react";
import {useStore} from "pages/Data/Wrapper";
import {Chip, Container, Divider, Hidden, NoSsr, Paper, Typography} from "@material-ui/core";
import {useStorage} from "auxiliary/useStorage";
import {Col, Row, RowGrid} from "pages/Base/Grid";
import {ArraySlice} from "components/generic/components/ArraySlice";
import ItemCard from "./ItemCard";
import {InfoCard} from "pages/Base/InfoCard";
import {useNotification} from "components/wrappers/NotifyWrapper";
import {AutoCompleteCustom} from "components/AutoCompleteCustom";
import {Meta} from "pages/Base/Meta";
import {PersonalDiscount} from "pages/Base/PersonalDiscount";
import {HowToUse} from "pages/Base/HowToUse";
import {TrustBox} from "pages/Base/TrustBox";

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

declare let LiveChatWidget: any;

const Shop: React.FC = () => {
    const {notify} = useNotification();
    const {current: {shop, game}} = useStore();

    const {tags, items} = shop();
    const itemIds = Object.keys(items.id).filter(t => !items.id[t].direct);
    const tagIds = Object.keys(tags.id);

    const [state, setState] = useStorage<IShopState>('shop', defaultState, (state) => {
        const result = {...defaultState, ...state};

        result.tags = result.tags.filter(n => tagIds.includes(n));
        result.names = result.names.filter(n => itemIds.includes(n));

        return result;
    });

    const nameSet = useMemo(() => new Set(state.names), [state.names]);
    const tagSet = useMemo(() => new Set(
        state.tags.length > 0 ? shop().getTagDeps(state.tags[state.tags.length - 1]) : [],
    ), [state.tags]);

    //  TODO: make readale
    const filterItems = () => itemIds
        .filter(itemId => (
            nameSet.size === 0 ||
            nameSet.has(itemId) ||
            items.id[itemId].item.some(i => nameSet.has(i))
        ) && (
                state.tags.length === 0 ||
                items.id[itemId].tag.some(t => tagSet.has(t))));

    const renderMock = () => (
        <InfoCard text={[
            'Unfortunately, nothing was found',
            'Try next time or change some filters',
        ]} />
    );

    const renderItems = (data: string[]) => (
        <ArraySlice data={data} prefix="shop-pagination"
            scroll={300} chunk={36} noSelect>
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
                    LiveChatWidget?.call('maximize');
                    notify("Ask us for the custom order, we will serve it to you!");
                }}
                getLabel={(itemId) => itemId in items.id ? items.id[itemId].name : "unknown"}
            />
        </NoSsr>
    );

    const tag = (tagId: string, depth = 0) => (
        <Chip
            style={{marginBottom: 4, marginRight: 8}}
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
        <NoSsr>
            <Row justify="space-between">
                <Paper style={{width: "100%"}}>
                    <Col p={8}>
                        <Row p={[2, 8]} wrap>
                            {tags.base.map(tagId => tag(tagId))}
                        </Row>
                        {state.tags.map((tagId, index) => tags.id[tagId].children.length > 0 && (
                            <Col s={8} p={8} key={tagId}>
                                <Divider />
                                <Row p={[2, 0]} wrap>
                                    {tags.id[tagId].children.map(tagId => tag(tagId, index + 1))}
                                </Row>
                            </Col>
                        ))}
                    </Col>
                </Paper>

                <Hidden mdDown>
                    <Paper elevation={2} style={{
                        minWidth: 320,
                        marginLeft: 16,
                    }}>
                        <TrustBox size="mikro" />
                    </Paper>
                </Hidden>
            </Row>
        </NoSsr>
    );

    const howto = () => (
        <Col s={16} style={{marginTop: 16}}>
            <Typography variant="h4" noWrap style={{
                minWidth: "fit-content",
                fontWeight: 300,
            }}>
                {`How to use our service`}
            </Typography>
            <HowToUse />
        </Col>
    );

    return (
        <>
            <Meta entity={game} />
            <Container fixed style={{padding: 0}}>
                <Col s={16}>
                    {filterNames()}
                    {filterTags()}
                    {filterData()}
                    <PersonalDiscount />
                    {howto()}
                </Col>
            </Container>
        </>
    );
};

export default Shop;
