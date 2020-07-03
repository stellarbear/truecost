import React, {CSSProperties, useContext, useEffect, useState} from "react";
import {
    Button,
    Card,
    Chip,
    createStyles,
    Divider,
    FormControl,
    Hidden,
    IconButton,
    Input,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Typography,
    withStyles,
} from "@material-ui/core";
import {createFilterOptions, TreeItem, TreeView} from "@material-ui/lab";
import {ArrowDownward, ArrowUpward, Cancel, ChevronRight, ExpandMore, MoreHoriz} from "@material-ui/icons";
import {CartContext} from "pages/Base/CartWrapper";
import Pagination from "./Base/Pagination";
import BackTopTop from "components/BactToTop";
import {RouteComponentProps, withRouter} from "react-router-dom";
import colors from "theme/colors";
import {Storage} from "auxiliary/storage";
import {sortByOrder} from "auxiliary/sort";
import {NotificationContext} from "components/wrappers";
import Meta from "./Base/Meta";

declare let Tawk_API: any;

const StyledTreeItem = withStyles({
    root: {
        //color: colors.primaryColor,
        '&:focus > $content': {
            //backgroundColor: colors.primaryColor,
            //color: "#fff",
        },
    },
    content: {
        //color: colors.primaryColor,
        borderRadius: 6,
        marginRight: 8,
    },
})(TreeItem);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        body: {
            width: 640,
            [theme.breakpoints.up(1440)]: {
                width: 960,
            },
            [theme.breakpoints.down(658)]: {
                width: '94vh',
            },
        },
        side: {
            marginTop: 7,
            width: 240,
        },
        margin: {
            boxShadow:
                "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
            [theme.breakpoints.down(658)]: {
                margin: "10px 10px 0px",
            },
            [theme.breakpoints.up(658)]: {
                margin: "30px 30px 0px",
            },
            [theme.breakpoints.up(1600)]: {
                margin: "30px auto",
            },
        },
    }),
);

export interface ShopState {
    activeCategory: string;
    activeItems: string[];
    activeTags: string[];
    sort: {
        field: string;
        order: "asc" | "desc";
    };
}

export const defaultShopState: ShopState = {
    activeCategory: "",
    activeItems: [],
    activeTags: [],
    sort: {
        field: "default",
        order: "asc",
    },
};
export const storageShopKey = ["shop", "filters"];
export const storageScrollKey = ["shop", "scroll"];
export const storageScrollPersistKey = ["shop", "scroll!"];

type IShopProps = RouteComponentProps;

const Shop: React.FC<IShopProps> = ({
                                        location,
                                    }): JSX.Element => {
    const classes = useStyles();

    const {
        store: {
            tagList,
            itemList,
            categoryList,
        },
    } = useContext(CartContext);
    const {notify} = React.useContext(NotificationContext);

    const verifyState = (): ShopState => {
        const local = Storage.getItem(storageShopKey, defaultShopState);

        return ({
            activeCategory: (local.activeCategory in categoryList) ? local.activeCategory : '',
            activeItems: local.activeItems.filter((i: string) => i in itemList),
            activeTags: local.activeTags.filter((t: string) => t in tagList),
            sort: local.sort,
        });
    };

    const [state, setState] = useState<ShopState>(verifyState());
    const [scroll, setScroll] = useState<number>(Storage.getItem(storageScrollPersistKey, 0));

    const filteredItems = Object.keys(itemList)
        .filter(key => itemList[key].isActive)
        .filter(key => itemList[key].only.length === 0);

    const onStateChange = (key: keyof ShopState, value: any) => {
        //console.log("state update", key)
        const newState = {...(key === "activeItems" ? defaultShopState : state), [key]: value};

        Storage.setItem(storageShopKey, newState);
        setState(newState);

        window.scroll({top: 0, left: 0, behavior: "smooth"});
    };

    const onScroll = () => {
        const newScroll = window.pageYOffset;
        Storage.setItem(storageScrollKey, newScroll);
        setScroll(newScroll);
    };

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        const newState: ShopState = verifyState();
        const newScroll: number = Storage.getItem(storageScrollPersistKey, 0);
        setState(newState);
        setScroll(newScroll);

        setTimeout(() => {
            window.scroll({top: newScroll, left: 0, behavior: "smooth"});
        }, 0);

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const renderFullSubCategories = (node: string[] = []) => {
        const keys = node.length === 0 ? Object.keys(categoryList).filter(key => categoryList[key].parent === null) : node;
        sortByOrder(keys, categoryList);

        return (
            <React.Fragment>
                {
                    keys.map(id => (
                        <StyledTreeItem
                            style={{
                                margin: 4,
                                //backgroundColor: state.activeCategory === id ? colors.primaryColor : "transparent"
                            }}
                            key={`filter-${id}`}
                            nodeId={`filter-${id}`}
                            onClick={() => onStateChange("activeCategory", id)}
                            label={categoryList[id].name}
                        >
                            {categoryList[id].children.length > 0
                                ? renderFullSubCategories(categoryList[id].children)
                                : null
                            }
                        </StyledTreeItem>
                    ))
                }
            </React.Fragment>
        );
    };

    const renderSmallSubCategories = (node: string[] = [], depth = 1): React.ReactNode[] => {
        const keys = node.length === 0 ? Object.keys(categoryList).filter(key => categoryList[key].parent === null) : node;
        sortByOrder(keys, categoryList);

        return (keys.map(id => {
            return (
                [
                    <MenuItem
                        value={id}
                        key={`filter-${id}`}
                        style={{paddingLeft: 20 * depth}}
                    >
                        {categoryList[id].name}
                    </MenuItem>,
                    categoryList[id].children.length > 0 &&
                    renderSmallSubCategories(categoryList[id].children, depth + 1),
                ]
            );
        }));
    };

    const renderSmallCategories = () => {
        const categories = Object.keys(categoryList);
        if (categories.length === 0) {
            return null;
        }

        return (
            <React.Fragment>
                <FormControl style={{width: "100%"}}>
                    <InputLabel>Categories</InputLabel>
                    <Select
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 300,
                                },
                            },
                        }}
                        value={state.activeCategory}
                        onChange={({target: {value}}) => onStateChange("activeCategory", state.activeCategory === value ? "" : value)}
                        input={<Input id="select-multiple-chip"/>}
                        renderValue={(_) => <Chip style={{margin: "2px 2px 0px 0px"}}
                                                  label={categoryList[state.activeCategory].name}/>}
                    >
                        {renderSmallSubCategories()}
                    </Select>
                </FormControl>
            </React.Fragment>
        );
    };

    const renderFullCategories = () => {
        const categories = Object.keys(categoryList);
        if (categories.length === 0) {
            return null;
        }

        return (
            <div style={{transition: "margin 700ms", position: "fixed", marginTop: scroll > 50 ? -50 : 0}}>
                <div style={{height: 32, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography
                            component="div" variant="caption"
                            style={{
                                display: "table-cell", verticalAlign: "bottom",
                                marginTop: state.activeCategory in categoryList ? -20 : 0,
                                transition: "all 0.3s",
                            }}>{
                            `Categories: `
                        }</Typography>
                        <Typography
                            component="div" variant="subtitle1"
                            style={{display: "table-cell", verticalAlign: "bottom"}}>{
                            state.activeCategory in categoryList
                            && categoryList[state.activeCategory].name
                        }</Typography>
                    </div>
                    <IconButton
                        color="secondary"
                        disabled={state.activeCategory === ''}
                        size="small"
                        onClick={() => onStateChange("activeCategory", '')}>
                        <Cancel/>
                    </IconButton>
                </div>
                <Divider style={{margin: 8}}/>
                <Card style={{display: "flex", flexDirection: "column", padding: 0, marginTop: 8}}>
                    <TreeView
                        style={{
                            maxHeight: `calc(100vh - ${150 + (scroll > 70 ? 0 : 70)}px)`,
                            overflow: "auto",
                            width: "100%",
                        }}
                        defaultEndIcon={<MoreHoriz style={{opacity: 0.0}}/>}
                        defaultCollapseIcon={<ExpandMore/>}
                        defaultExpandIcon={<ChevronRight/>}
                    >
                        {renderFullSubCategories()}
                    </TreeView>
                </Card>

                <Button variant="contained" color="default" onClick={() => {
                    Tawk_API?.maximize();
                    notify("Ask us for the custom order, we will serve it to you!");
                }} style={{marginTop: 16, width: "100%"}}>
                    {"Custom order"}
                </Button>
            </div>
        );
    };

    const collectCategories = (key: string, result: string[] = []) => {
        result.push(key);
        categoryList[key].children
            .map(key => collectCategories(key, result));

        return result;
    };


    const renderItems = () => {
        const categoryList = state.activeCategory === ''
            ? [] : collectCategories(state.activeCategory);

        const ids = filteredItems
            .filter(key => state.activeItems.length > 0
                ? state.activeItems.includes(key) || itemList[key].items.some(item => state.activeItems.includes(item))
                : true)
            .filter(key => state.activeTags.length > 0
                ? itemList[key].tag.some(t => state.activeTags.includes(t))
                : true)
            .filter(key => categoryList.length > 0
                ? itemList[key].category.some(t => categoryList.includes(t))
                : true);

        const order = state.sort.order === "asc" ? 1 : state.sort.order === "desc" ? -1 : 0;

        ids.sort((a, b) => {
            const ia = itemList[a], ib = itemList[b];

            if (state.sort.field === "default") {
                return ia.order - ib.order;
            }
            if (typeof ia[state.sort.field] === "string") {
                const ias = (ia[state.sort.field] as string),
                    ibs = (ib[state.sort.field] as string);
                if (ias === ibs) {
                    return ia.order - ib.order;
                } else {
                    return (ias.localeCompare(ibs) * order);
                }
            } else if (typeof ia[state.sort.field] === "number") {
                const ian = (ia[state.sort.field] as number),
                    ibn = (ib[state.sort.field] as number);
                if (ian === ibn) {
                    return ia.order - ib.order;
                } else {
                    return (ian - ibn) * order;
                }
            }
            return ia.order - ib.order;
        });

        return (
            <Pagination ids={ids} deps={[...state.activeTags, state.activeCategory, ...state.activeItems]}/>
        );
    };

    const renderSort = (style: CSSProperties) => {
        return (
            <React.Fragment>
                <FormControl style={{marginLeft: 8, ...style}}>
                    <InputLabel id="state.sort-order">Sort by</InputLabel>
                    <Select
                        MenuProps={{
                            disableScrollLock: true,
                        }}
                        IconComponent={() => null}
                        labelId="state.sort-order"
                        value={state.sort.field}
                        onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                            onStateChange("sort", {...state.sort, field: event.target.value as string})}
                    >
                        <MenuItem value={"name"}>name</MenuItem>
                        <MenuItem value={"price"}>price</MenuItem>
                        <MenuItem value={"default"}>default</MenuItem>
                    </Select>
                </FormControl>
                <IconButton onClick={() => onStateChange("sort", {
                    ...state.sort,
                    order: state.sort.order === "asc" ? "desc" : "asc",
                })}>
                    {state.sort.order === "asc" ? <ArrowUpward/> : <ArrowDownward/>}
                </IconButton>
            </React.Fragment>
        );
    };

    const renderSearch = () => {
        const options = filteredItems
            .map(key => ({
                    id: key,
                    name: itemList[key].name,
                    items: itemList[key].items,
                }),
            ).sort();

        const filter = createFilterOptions();

        return (
            <React.Fragment>
                <div style={{display: "flex", padding: "0px 14px", alignItems: "flex-end"}}>
                    <div style={{width: "100%"}}>
                        {/*<Autocomplete
							multiple
							id="search-items"
							value={state.activeItems.map(id => ({
								id,
								name: itemList[id].name,
							}))}
							filterOptions={(options, params) => {
								const filtered = filter(options, params) as any[];

								if (params.inputValue !== '') {
									filtered.push({
										custom: params.inputValue,
										name: `CUSTOM ORDER: "${params.inputValue}"`,
									});
								}

								return filtered;
							}}
							autoComplete
							autoHighlight
							disableOpenOnFocus
							onChange={(_, value) => {
								const newItem = (Array.isArray(value) ? value[value.length - 1] : value);

								if (newItem ) {
									Tawk_API?.maximize()
									notify("Ask us for the custom order, we will serve it to you!")

									return;
								}

								console.log("changing")
								onStateChange("activeItems", value.map((v: any) => v.id))

							}}
							options={options}
							renderTags={(value: string[], getTagProps) =>
								value.map((v: any, index: number) => (
									<Chip style={{ margin: "8px 2px" }} variant="outlined" label={v.name}{...getTagProps({ index })} />
								))
							}
							getOptionLabel={item => item.name}
							//filterOptions={createFilterOptions({ matchFrom: 'start', })}
							style={{ width: "100%" }}
							renderInput={params => (
								<TextField {...params} variant="filled" label="Search by name" fullWidth />
							)}
							/>*/}
                    </div>
                    <Hidden xsDown>
                        {renderSort({width: 140})}
                    </Hidden>
                </div>
                <Hidden smUp>
                    <div style={{display: "flex", margin: 8}}>
                        {renderSort({width: "100%"})}
                    </div>
                </Hidden>
            </React.Fragment>
        );
    };

    const renderFullTags = () => {
        const tags = Object.keys(tagList).sort((a, b) => {
            if (tagList[a].order !== tagList[b].order) {
                return tagList[a].order - tagList[b].order;
            }

            return tagList[a].name.localeCompare(tagList[b].name);
        });

        if (tags.length === 0) {
            return null;
        }

        return (
            <div style={{transition: "margin 700ms", position: "fixed", marginTop: scroll > 50 ? -50 : 0}}>
                <div style={{height: 32, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <Typography
                        component="div" variant="caption"
                        style={{display: "table-cell", verticalAlign: "bottom"}}>Tags: </Typography>
                    <IconButton
                        color="secondary"
                        disabled={state.activeTags.length === 0}
                        size="small"
                        onClick={() => onStateChange("activeTags", [])}>
                        <Cancel/>
                    </IconButton>
                </div>
                <Divider style={{margin: 8}}/>
                {
                    tags.map(id =>
                        <div
                            key={`tag-${id}`}
                            style={{margin: 4}}>
                            <Chip
                                avatar={tagList[id].discount > 0
                                    ? <Chip color="secondary"
                                            style={{width: "fit-content", backgroundColor: colors.accentColor}}
                                            label={`${tagList[id].discount} % sale`}/>
                                    : undefined}
                                label={tagList[id].name}
                                color="primary" variant={state.activeTags.includes(id) ? "default" : "outlined"}
                                onClick={() => {
                                    onStateChange("activeTags", state.activeTags.includes(id) ? state.activeTags.filter(e => e !== id) : [...state.activeTags, id]);
                                }}/>
                        </div>,
                    )
                }
            </div>
        );
    };

    const renderSmallTags = () => {
        const tags = Object.keys(tagList).sort((a, b) => {
            if (tagList[a].order !== tagList[b].order) {
                return tagList[a].order - tagList[b].order;
            }

            return tagList[a].name.localeCompare(tagList[b].name);
        });

        if (tags.length === 0) {
            return null;
        }

        return (
            <React.Fragment>
                <FormControl style={{width: "100%"}}>
                    <InputLabel>Tags</InputLabel>
                    <Select
                        multiple
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 300,
                                },
                            },
                        }}
                        value={state.activeTags}
                        onChange={(event) => {
                            onStateChange("activeTags", event.target.value as string[]);
                        }}
                        input={<Input id="select-multiple-chip"/>}
                        renderValue={(selected) => (
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                {(selected as string[]).map(id => (
                                    <Chip style={{margin: "2px 2px 0px 0px"}} key={id} label={tagList[id].name}/>
                                ))}
                            </div>
                        )}
                    >
                        {tags.map(id => (
                            <MenuItem key={id} value={id}>
                                {tagList[id].name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </React.Fragment>
        );
    };


    return (
        <React.Fragment>
            <Meta page="shop"/>
            <div style={{display: "flex", justifyContent: "center", flexDirection: "row", width: "100vw"}}>
                <div className={classes.body}>
                    {renderSearch()}
                    <Hidden lgUp>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "flex-end",
                        }}>
                            <div style={{marginLeft: 14, marginRight: 4, width: "100%"}}>
                                {renderSmallCategories()}
                            </div>
                            <div style={{marginLeft: 4, marginRight: 14, width: "100%"}}>
                                {renderSmallTags()}
                            </div>
                        </div>
                    </Hidden>
                </div>
            </div>
            <BackTopTop>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    position: "relative",
                    width: "100vw",
                }}>
                    <Hidden mdDown>
                        <div className={classes.side} style={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}>
                            {renderFullCategories()}
                        </div>
                    </Hidden>

                    <div className={classes.body}>
                        {renderItems()}
                    </div>

                    <Hidden mdDown>
                        <div className={classes.side}>
                            {renderFullTags()}
                        </div>
                    </Hidden>

                </div>
            </BackTopTop>
        </React.Fragment>
    );
};

export default withRouter(Shop);
