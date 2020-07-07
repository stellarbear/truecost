import {
    Card,
    createStyles,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Theme,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
} from "@material-ui/core";
import {useMutation} from "react-apollo";
import React, {useEffect} from "react";
import {Cancel, Delete, FilterList, Save} from "@material-ui/icons";

import {NotificationContext} from "components/wrappers";
import {TimeoutButton} from "components";
import {colors} from "theme";
import {ItemProp} from "./types";
import {getResolverName, parseQLErrors} from "auxiliary";
import {PaginationContext} from "./Pagination";
import {Component} from "./types/ABase";
import {Storage} from "auxiliary/storage";

import {ReactSortable} from "react-sortablejs";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: "100%",
            marginTop: 0,
            paddingBottom: 4,
            maxHeight: "calc(100vh - 200px)",
            overflow: "auto",
        },
        table: {
            width: "100%",
        },
        modal: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        spacer: {
            flex: "1 1 100%",
        },
        actions: {
            color: theme.palette.text.secondary,
        },
        title: {
            flex: "0 0 auto",
        },
        noPadding: {
            padding: 0,
        },
        stickyRight: {
            zIndex: 1,
            position: "sticky",
            padding: 0,
            right: 0,
        },
        noBorder: {
            padding: 0,
            border: "none",
        },
        headerCell: {
            backgroundColor: colors.primaryColor,
            color: theme.palette.common.white,
        },
    }),
);


const TableCellLow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: "center",
            padding: "0px 0px 0px 16px",
        },
    }),
)(TableCell);

interface IItem {
    id: string;

    [key: string]: any;
}

interface UserListProps {
    pack?: string;
    props: ItemProp[];
    actionsGlobal?: (() => React.ReactNode)[];
    actionsLocal?: ((def: {}) => React.ReactNode)[];
    title: string;
    visibleKeys?: string[];
    updateMutation: any;
    deleteMutation: any;
}

const deepEqual = (x: any, y: any): boolean => {
    const ok = Object.keys, tx = typeof x, ty = typeof y;

    if (x == null || y == null) {
        return x == null && y == null;
    }

    if (x.constructor == File && y.constructor == File) {
        return (x.name == y.name && x.size == y.size && x.lastModified == y.lastModified);
    }

    return (x && y && tx === "object" && tx === ty
        ? (ok(x).length === ok(y).length && ok(x).every(key => deepEqual(x[key], y[key])))
        : (x === y)
    );
};

const flat = (data: Record<string, any>) => {
    for (const key in data) {
        if (data[key]?.id) {
            data[key] = data[key].id;
        } else if (Array.isArray(data[key])
            && data[key].length > 0
            && data[key][0].id) {
            data[key] = data[key].map((key: any) => key.id);
        }
    }
    return data;
};

interface UserError {
    id: string;
    keys: Record<string, any>;
}

const List: React.FC<UserListProps> = ({
    pack,
    title,
    props,
    actionsGlobal = [],
    actionsLocal = [],
    updateMutation,
    deleteMutation,
    visibleKeys = props.map((prop: ItemProp) => prop.key),
}) => {
    const classes = useStyles();

    const storageBaseKey = ["admin", "list", "columns", "list", title.toLowerCase().replace(/\s/, "_")];
    const storageVisibleKey = [...storageBaseKey, "visibility"];
    const storageOrderKey = [...storageBaseKey, "order"];

    const [orderColumns, setOrderColumns] = React.useState<string[]>(props.map((prop: ItemProp) => prop.key));
    const [visibleColumns, setVisibleColumns] = React.useState<string[]>(visibleKeys);
    const sortedProps = (orderColumns || []).map(o => props.find(p => p.key === o)!);
    const [filterAnchorEl, setFilterAnchorEl] = React.useState<null | HTMLElement>(null);

    const {items, refetchQuery, refetchQueryForce} = React.useContext(PaginationContext);

    const {notify} = React.useContext(NotificationContext);
    const [data, setData] = React.useState<IItem[]>([]);
    const [errors, setErrors] = React.useState<UserError>({id: "", keys: {}});
    const [changes, setChanges] = React.useState<IItem[]>([]);

    const [updateItemMutation] = useMutation(updateMutation);
    const [deleteItemMutation] = useMutation(deleteMutation);

    const deleteResponse = getResolverName(deleteMutation);
    const updateResponse = getResolverName(updateMutation);

    const getIndex = (item: IItem, state: IItem[]) =>
        state.map((u: IItem) => u.id).indexOf(item.id);

    const onChange = (
        item: IItem,
        prop: string,
        value: boolean | number[] | File,
    ) => {
        const newUser = {...item, [prop]: value};
        data[getIndex(item, data)] = newUser;
        setErrors({keys: {}, id: ""});
        setData([...data]);
    };
    const compare = (from: IItem, to: IItem): boolean => {
        return deepEqual(from, to);
    };

    const onVisibleChange = (columns: string[]) => {
        if (columns.length > 0) {
            setVisibleColumns(columns);
            Storage.setItem(storageVisibleKey, columns);
        }
    };

    useEffect(() => {
        setOrderColumns(Storage.getItem(storageOrderKey, orderColumns)
            .filter((e: string) => visibleKeys.includes(e)));
        setVisibleColumns(Storage.getItem(storageVisibleKey, visibleKeys)
            .filter((e: string) => visibleKeys.includes(e)));
    }, []);

    useEffect(() => {
        setData([...items]);
        setChanges([...items]);
    }, [items]);

    const onCancelChanges = (item: IItem, change: IItem) => {
        data[getIndex(item, data)] = change;
        setErrors({keys: {}, id: ""});
        setData([...data]);
    };

    const onUpdate = async (item: IItem) => {
        try {
            const {__typename, ...rest} = item;
            const mutationData = {...flat(rest)};
            const mutationVariables = pack == undefined ? mutationData : {[pack]: mutationData};
            console.log("mutation sent", mutationVariables);
            const response = await updateItemMutation({variables: mutationVariables});
            if (response && response.data && response.data[updateResponse]) {
                notify(`record ${item.id} was updated`);
                await refetchQueryForce();
            } else {
                notify("record was not found");
            }
        } catch (e) {
            notify("constrains failed");
            const errors = parseQLErrors(e);
            setErrors({id: item.id, keys: {...errors}});
        }
    };

    const onDelete = async (item: IItem) => {
        const {id} = item;
        try {
            const mutationVariables = pack == undefined ? {id} : {[pack]: {id}};
            console.log("mutation sent", {...mutationVariables});
            const response = await deleteItemMutation({variables: {...mutationVariables}});
            if (response && response.data && response.data[deleteResponse]) {
                notify(`record ${item.id} was deleted`);
                await refetchQuery();
            } else {
                notify("record is already deleted or cannot be found");
            }
        } catch (e) {
            notify("constrains failed");
            const errors = parseQLErrors(e);
            setErrors({id: item.id, keys: {...errors}});
        }
    };

    const buildEditButtons = (item: IItem, change: IItem) => {
        const similar = compare(item, change);

        return (
            <Card style={{margin: "6px 0px"}}>
                <div style={{display: "flex"}}>
                    {actionsLocal.map((action, index) =>
                        <div className={classes.actions} key={`action-local-${item.id}-${index}`}>
                            {action(item)}
                        </div>,
                    )}
                    <Tooltip title="Save changes">
                        <IconButton component="div"
                            disabled={similar}
                            onClick={() => onUpdate(item)}
                        >
                            <Save />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel changes">
                        <IconButton component="div"
                            disabled={similar}
                            onClick={() => onCancelChanges(item, change)}
                        >
                            <Cancel />
                        </IconButton>
                    </Tooltip>

                    <TimeoutButton
                        timeout={3}
                        tooltip="Delete"
                        icon={<Delete />}
                        onClickEvent={() => onDelete(item)}
                    />
                </div>
            </Card>
        );
    };

    const buildBodyCell = (item: IItem, prop: ItemProp) => {
        const {id} = item;
        const {key, prepare} = prop;
        const value = prepare(item[key]);

        return prop.render({
            id,
            data: item,
            value,
            errors: errors.id == id ? errors.keys[key] || [] : [],
            component: Component.List,
            onChange: (event: any) => onChange(item, key, event),
        });
    };


    const buildBodyRow = (item: IItem) => {
        const change = changes[getIndex(item, changes)];
        return (
            <React.Fragment>
                {sortedProps
                    .filter((prop: ItemProp) => visibleColumns.includes(prop.key))
                    .map((prop: ItemProp, index: number) => (
                        <TableCellLow
                            align="right"
                            key={`table-row-${item.id}-cell-${prop.key}-${index}`}>
                            <div style={{marginTop: 16}}>
                                {buildBodyCell(item, prop)}
                            </div>
                        </TableCellLow>
                    ))}
                <TableCellLow className={classes.stickyRight}>
                    {buildEditButtons(item, change)}
                </TableCellLow>
            </React.Fragment>
        );
    };

    const buildHeadRow = () => {
        return (
            <React.Fragment>
                {sortedProps
                    .filter((prop: ItemProp) => visibleColumns.includes(prop.key))
                    .map((prop: ItemProp, index: number) => (
                        <TableCell
                            align="center"
                            className={classes.headerCell}
                            key={`table-head-${prop.key}-${index}`}>
                            {prop.label}
                        </TableCell>
                    ))}
                <TableCell
                    colSpan={3}
                    align="center"
                    className={classes.headerCell}>
                    <span>actions</span>
                </TableCell>
            </React.Fragment>
        );
    };

    const buildVisibleFilter = () => {
        return (
            <React.Fragment>
                <Tooltip title="Select columns" placement="top" style={{marginRight: 8}}>
                    <IconButton
                        onClick={(event) => setFilterAnchorEl(event.currentTarget)}
                        aria-label="filter list">
                        <FilterList />
                    </IconButton>
                </Tooltip>
                <Menu
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
                                        key={`selected-list-prop-${prop.key}`}
                                        selected={visibleColumns.includes(prop.id)}
                                        onClick={() => {
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

    const buildTableToolbar = () => {
        return (
            <Toolbar style={{
                paddingRight: 0,
                position: "sticky",
                left: 0,
            }}>
                <div className={classes.title}>
                    <Typography variant="h6" id="tableTitle">
                        {title}
                    </Typography>
                </div>
                <div className={classes.spacer} />
                {actionsGlobal.map((action, index) =>
                    <div className={classes.actions} title="create new user" key={`action-global-${index}`}>
                        {action()}
                    </div>,
                )}
                <div className={classes.actions}>
                    {buildVisibleFilter()}
                </div>
            </Toolbar>
        );
    };

    return (
        <Paper className={classes.root}>
            {buildTableToolbar()}
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        {buildHeadRow()}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0
                        ? data.map((item: IItem, index: number) => (
                            <TableRow key={`table-row-${item.id}-${index}`}>
                                {buildBodyRow(item)}
                            </TableRow>
                        ))
                        :
                        <TableRow>
                            <td>
                                <Typography style={{textAlign: "center", padding: 8}}>No records found</Typography>
                            </td>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </Paper>
    );
};

export default List;
