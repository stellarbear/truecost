import {Chip, Container, Divider, NoSsr, Paper, Typography} from "@material-ui/core";
import {useStorage} from "auxiliary/useStorage";
import {BreadCrumbs} from "components";
import {AutoCompleteCustom} from "components/AutoCompleteCustom";
import {ArraySlice} from "components/generic/components/ArraySlice";
import {Markdown} from 'components/Markdown';
import {useNotification} from "components/wrappers/NotifyWrapper";
import {Col, Row, RowGrid} from "pages/Base/Grid";
import {HowToUse} from "pages/Base/HowToUse";
import {InfoCard} from "pages/Base/InfoCard";
import {Meta} from "pages/Base/Meta";
import {TrustBox} from "pages/Base/TrustBox";
import {useStore} from "pages/Data/Wrapper";
import React, {useMemo} from "react";
import {useHistory, useParams} from "react-router";
import {Link} from "react-router-dom";
import ItemCard from "./ItemCard";
import {ShopSeo} from "./ShopSeo";

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

interface IParams {
    tag?: string;
}

const Shop: React.FC = () => {
    const {tag: urlTag} = useParams<IParams>();
    const {notify} = useNotification();
    const history = useHistory();

    const {current: {shop, game}} = useStore();

    const {tags, items} = shop();
    const itemIds = Object.keys(items.id).filter(t => !items.id[t].direct);
    const tagIds = Object.keys(tags.id);

    const [state, setState] = useStorage<IShopState>('shop', defaultState, (state) => {
        const result = {...defaultState, ...state};

        if (urlTag && urlTag in tags.url) {
            result.tags = [tags.url[urlTag]];
        } else {
            result.tags = result.tags.filter(n => tagIds.includes(n));
        }

        result.names = result.names.filter(n => itemIds.includes(n));

        return result;
    });

    const currentTags = state.tags.filter(tagId => tagId in tags.id);

    React.useEffect(() => {
        const current = currentTags[0] ?? null;
        const url = Object.keys(tags.url).find(e => tags.url[e] === current) ?? null;
        const newUrl = `/${game.url}${url ? `/${url}` : ""}`;

        if (newUrl !== history.location.pathname) {
            history.replace({pathname: newUrl});
        }
    }, [currentTags[0], game.url]);

    const nameSet = useMemo(() => new Set(state.names), [state.names]);
    const tagSet = useMemo(() => new Set(
        currentTags.length > 0 ? shop().getTagDeps(currentTags[currentTags.length - 1]) : [],
    ), [currentTags]);

    //  TODO: make readale
    const filterItems = () => itemIds
        .filter(itemId => (
            nameSet.size === 0 ||
            nameSet.has(itemId) ||
            items.id[itemId].item.some(i => nameSet.has(i))
        ) && (
                currentTags.length === 0 ||
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

    const tag = (tagId: string, depth = 0) => {
        const active = currentTags.includes(tagId);
        const url = Object.keys(tags.url).find(key => tags.url[key] === tags.id[tagId].id);

        const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.stopPropagation();
            e.preventDefault();

            const index = currentTags.indexOf(tagId);

            setState({
                ...state,
                tags: index === -1
                    ? [...currentTags.slice(0, depth), tagId]
                    : currentTags.slice(0, index),
            });
        };

        return (
            <Chip
                to={url ? `/${game.url}/${url}` : ""}
                component={Link}
                style={{marginBottom: 4, marginRight: 8}}
                key={tagId}
                label={tags.id[tagId].name}
                clickable
                onClick={onClick}
                onDelete={active ? onClick : undefined}
                color={active ? "primary" : undefined}
            />
        );
    };

    const filterTags = () => Object.keys(tags.base).length > 0 && (
        <NoSsr>
            <Paper style={{width: "100%"}}>
                <Col p={8}>
                    <Row p={[2, 8]} wrap>
                        {tags.base.map(tagId => tag(tagId))}
                    </Row>
                    {currentTags
                        .map((tagId, index) => tags.id[tagId].children.length > 0 && (
                            <Col s={8} p={8} key={tagId}>
                                <Divider />
                                <Row p={[2, 0]} wrap>
                                    {tags.id[tagId].children.map(tagId => tag(tagId, index + 1))}
                                </Row>
                            </Col>
                        ))}
                </Col>
            </Paper>
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

    const hasTag = currentTags.length > 0;
    const hasSeo = game.seo && game.seo.length > 0;

    const seoGame = () => {
        if (hasTag && tags.id[currentTags[0]].seo?.length > 0) {
            return (
                <Col s={16} style={{marginTop: 16}}>
                    <Typography variant="h4" noWrap style={{
                        minWidth: "fit-content",
                        fontWeight: 300,
                    }}>
                        {tags.id[currentTags[0]].name}
                    </Typography>
                    <Markdown style={{opacity: 0.7}}>
                        {tags.id[currentTags[0]].seo}
                    </Markdown>
                </Col>
            );
        }

        return hasSeo && (
            <Col s={16} style={{marginTop: 16}}>
                <Typography variant="h4" noWrap style={{
                    minWidth: "fit-content",
                    fontWeight: 300,
                }}>
                    {`Frequently asked questions`}
                </Typography>
                <ShopSeo game={game} />
            </Col>
        );
    };

    return (
        <>
            {hasTag ? (
                <Meta silent>
                    <title>
                        {`${tags.id[currentTags[0]].name} on ${game.name} - Boosting Service by TrueCost`}
                    </title>
                    <meta name="description" content={
                        `Choose TrueCost, the #1 ${game.name} ${tags.id[currentTags[0]].name} boosting service. ` +
                        `Top-tier players will carry your operator and help you get the kills and wins you need!`
                    } />
                </Meta>
            ) : <Meta entity={game} />}
            <Container fixed style={{padding: 0}}>
                <Col s={16}>
                    <BreadCrumbs
                        options={[
                            [`/${game.url}/`, `Shop ${game.name}`],
                        ]}
                    />
                    {filterNames()}
                    {filterTags()}
                    <Paper elevation={6}>
                        <TrustBox size="mikro" />
                    </Paper>
                    {hasTag && (
                        <Typography variant="h6" component="h1">
                            {tags.id[currentTags[0]].name}
                        </Typography>
                    )}
                    {filterData()}
                    {howto()}
                    {seoGame()}
                </Col>
            </Container>
        </>
    );
};

export default Shop;
