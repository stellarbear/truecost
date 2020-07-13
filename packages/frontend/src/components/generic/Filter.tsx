import React, {useEffect} from "react";
import {Card, Divider, Drawer, Grid, IconButton, Menu, MenuItem, Tooltip, Typography} from "@material-ui/core";
import {FilterList} from "@material-ui/icons";

import {ItemProp} from "./types";
import {PaginationContext} from "./Pagination";
import {Component} from "./types/ABase";
import {Storage} from "auxiliary/storage";
import {ReactSortable} from "react-sortablejs";

interface IItem {
    id: string;

    [key: string]: any;
}

interface UserListProps {
    title: string;
    props: ItemProp[];
    updateTimeout?: number;
}

const Filter: React.FC<UserListProps> = ({
                                             title,
                                             props,
                                             updateTimeout = 1500,
                                         }): JSX.Element => {
    const storageBaseKey = ["admin", "list", "columns", "filter", title.toLowerCase().replace(/\s/, "_")];
    const storageVisibleKey = [...storageBaseKey, "visibility"];
    const storageOrderKey = [...storageBaseKey, "order"];

    const visibleKeys = props.map((prop: ItemProp) => prop.key);
    const [orderColumns, setOrderColumns] = React.useState<string[]>(props.map((prop: ItemProp) => prop.key));
    const [visibleColumns, setVisibleColumns] = React.useState<string[]>(visibleKeys);
    const sortedProps = (orderColumns || []).map(o => props.find(p => p.key === o)!);
    const [filterAnchorEl, setFilterAnchorEl] = React.useState<null | HTMLElement>(null);

    const {updateQueryParams} = React.useContext(PaginationContext);
    const defaultState = props.reduce((obj, prop) => Object.assign(obj, {[prop.key]: undefined}), {});
    const [state, setState] = React.useState<any>(defaultState);
    const [debounceTimerID, setDebounceTimerID] = React.useState<NodeJS.Timeout>();

    const [drawer, setDrawer] = React.useState(false);

    useEffect(() => {
        setOrderColumns(Storage.getItem(storageOrderKey, orderColumns)
            .filter((e: string) => visibleKeys.includes(e)));
        setVisibleColumns(Storage.getItem(storageVisibleKey, visibleKeys)
            .filter((e: string) => visibleKeys.includes(e)));
    }, []);

    const onVisibleChange = (columns: string[]) => {
        if (columns.length > 0) {
            setVisibleColumns(columns);
            Storage.setItem(storageVisibleKey, columns);
        }
    };

    const onChange = (prop: string, value: any) => {
        if (debounceTimerID) {
            clearTimeout(debounceTimerID);
        }

        const newState = {...state, [prop]: value};
        setState(newState);

        const timer = setTimeout(() => {
            const params = {...newState};
            Object.keys(params).forEach(key => params[key] == undefined && delete params[key]);
            console.log(params);
            updateQueryParams({...params});
        }, updateTimeout);
        setDebounceTimerID(timer);
    };

    const buildVisibleFilter = () => {
        return (
            <React.Fragment>
                <Tooltip title="Select columns" placement="top" style={{marginRight: 8}}>
                    <IconButton
                        onClick={(event) => {
                            setFilterAnchorEl(event.currentTarget);
                            event.stopPropagation();
                        }}
                        aria-label="filter list">
                        <FilterList/>
                    </IconButton>
                </Tooltip>
                <Menu
                    onClick={(e) => e.stopPropagation()}
                    keepMounted
                    disableScrollLock
                    anchorEl={filterAnchorEl}
                    onClose={() => setFilterAnchorEl(null)}
                    open={Boolean(filterAnchorEl)}
                >
                    <ReactSortable
                        list={sortedProps}
                        setList={state => {
                            if (sortedProps.length != state.length) {
                                return;
                            }

                            const cid = sortedProps.map(c => c.id);
                            const sid = state.map(s => s.id);
                            const hasChanges = cid.join() !== sid.join();
                            if (hasChanges) {
                                const order = state.map(s => s.key);
                                setOrderColumns(order);
                                Storage.setItem(storageOrderKey, order);
                            }
                        }}>
                        {
                            sortedProps
                                .map((prop) =>
                                    <MenuItem
                                        value={prop.key}
                                        key={`selected-filter-prop-${prop.key}`}
                                        selected={visibleColumns.includes(prop.id)}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            const selected = visibleColumns.includes(prop.id);
                                            const newColumns = selected
                                                ? visibleColumns.filter(c => c !== prop.id)
                                                : [...visibleColumns, prop.id];
                                            onVisibleChange(newColumns);
                                        }}
                                    >
                                        {prop.key}
                                    </MenuItem>)

                        }
                    </ReactSortable>
                </Menu>
            </React.Fragment>
        );
    };

    const buildFilter = (prop: ItemProp) => {
        const {key} = prop;
        const value = state[key];
        const id = "filter";

        return prop.render({
            id,
            data: state,
            value,
            errors: [],
            component: Component.Filter,
            onChange: (event: any) => onChange(key, event),
        });
    };

    return (
        <React.Fragment>
            <Card onClick={() => setDrawer(true)}
                  style={{
                      display: "flex",
                      padding: "8px 0px 8px 16px",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      alignSelf: "flex-end",
                  }}>
                <Typography>Filter records</Typography>
                {buildVisibleFilter()}
            </Card>
            <Drawer anchor={'left'} open={drawer} onClose={() => setDrawer(false)}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center">
                    <Divider style={{minWidth: "330px", marginBottom: 16}}/>
                    {sortedProps
                        .filter((prop: ItemProp) => visibleColumns.includes(prop.key))
                        .map((prop: ItemProp) =>
                            <Grid item key={`filter-${prop.key}`}>
                                {buildFilter(prop)}
                            </Grid>,
                        )}
                </Grid>
            </Drawer>
        </React.Fragment>
    );
};

export default Filter;
