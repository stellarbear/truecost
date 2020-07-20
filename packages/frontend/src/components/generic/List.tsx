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
import {useMutation, useQuery} from "react-apollo";
import React, {useEffect, CSSProperties} from "react";
import FilterList from "@material-ui/icons/FilterList";
import Save from "@material-ui/icons/Save";
import Cancel from "@material-ui/icons/Cancel";
import Delete from "@material-ui/icons/Delete";

import {NotificationContext} from "components/wrappers";
import {TimeoutButton} from "components";
import {colors} from "theme";
import {ItemProp} from "./types";
import {getResolverName, parseQLErrors} from "auxiliary";
import {PaginationContext} from "./Pagination";
import {Storage} from "auxiliary/storage";

import {ReactSortable} from "react-sortablejs";
import {DocumentNode} from "graphql";
import {arrayToDict} from "auxiliary/sort";
import {useNotification} from "components/wrappers/NotifyWrapper";
import {normalize} from "./normalize";
import {Row} from "pages/Base/Grid";
import {useLoading} from "components/wrappers/LoadingWrapper";
import {ArraySlice} from "./components/ArraySlice";
import {IShared, useShared} from "./CRUD";

const stickyStyle: CSSProperties = {
    position: "sticky",
    left: 0,
    backgroundColor: "#FFFFFFDD",
    zIndex: 3,
}

type IItem = {id: string;[key: string]: any}
type IItems = Record<string, IItem>
type IError = Record<string, Record<string, string>>

interface UserListProps {
    props: ItemProp[];
    listQuery: DocumentNode;
    updateMutation: DocumentNode;
    removeMutation: DocumentNode;
}

export const List: React.FC<UserListProps> = ({
    props,
    listQuery,
    updateMutation,
    removeMutation,
}) => {
    const {setLoading} = useLoading();
    const {notify} = useNotification();
    const [share, setShare] = useShared();
    const [remove] = useMutation(removeMutation);
    const [update] = useMutation(updateMutation);
    const [count, setCount] = React.useState<number>(0);
    const [items, setItems] = React.useState<IItems>({});
    const [clones, setClones] = React.useState<IItems>({})
    const [errors, setErrors] = React.useState<IError>({});

    const {data, refetch} = useQuery(listQuery, {
        variables: {take: 0, skip: 0, input: normalize(share.vars)},
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        setShare({...share, fetch: () => refetch({take: 0, skip: 0, input: share.vars})})
    }, [])

    useEffect(() => {
        const listResponse = getResolverName(listQuery);
        if (data?.[listResponse]?.items) {
            const {items, count} = data[listResponse];

            console.log("query sent", normalize(share.vars));
            console.log("response received", items);

            const dict = arrayToDict<IItem>(items);
            setItems({...dict});
            setClones({...dict});
            setCount(count);
        }
    }, [data]);

    const onTry = async (callback: () => Promise<boolean>) => {
        try {
            setLoading(true);
            if (await callback()) {
                await refetch();
            } else {
                notify("server not responded or data corrupted");
            }
        } catch (e) {
            debugger;
            const fail = parseQLErrors(e)
            setErrors({id: {...fail}});
            notify(`constrains failed`, fail);
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async (id: string) => {
        await onTry(async () => {
            const response = await remove({variables: {input: {id}}});
            const name = getResolverName(removeMutation);

            if (response?.data?.[name]) {
                notify(`record ${id} was deleted`);
                return true;
            } else {
                return false;
            }
        })
    }

    const onUpdate = async (id: string) => {
        await onTry(async () => {
            console.log('trying sent', normalize(items[id]))
            const response = await update({variables: {input: normalize(items[id])}});
            const name = getResolverName(updateMutation);

            if (response?.data?.[name]) {
                notify(`record ${id} was updated`);
                return true;
            } else {
                return false;
            }
        })
    }

    const onChange = (id: string, key: string, value: any) => {
        const newItems = {...items, [id]: {...items[id], [key]: value}};
        setItems(newItems);
        setErrors({})
    }

    const onCancel = (id: string) => {
        setItems({...clones});
    }

    const render = (item: IItem, prop: ItemProp) => {
        const {data: {key}} = prop;

        return prop.renderAdd({
            value: item[key],
            error: errors?.[item.id]?.[key],
            state: item,
            onChange: (value: any) => onChange(item.id, key, value),
        } as any);
    };

    const actions = (id: string) => {
        const similar = JSON.stringify(items[id]) == JSON.stringify(clones[id])

        return (
            <Row>
                <IconButton disabled={similar} onClick={() => onUpdate(id)} >
                    <Save />
                </IconButton>
                <IconButton disabled={similar} onClick={() => onCancel(id)} >
                    <Cancel />
                </IconButton>
                <TimeoutButton timeout={3} icon={<Delete />} onClickEvent={() => onDelete(id)} />
            </Row>
        )
    }

    return (
        <ArraySlice data={Object.keys(items)}>
            {(itemIds => (
                <Paper style={{overflow: "auto"}}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell style={stickyStyle}>
                                    {"actions"}
                                </TableCell>
                                {props.map(({data: {label}}) => (
                                    <TableCell
                                        align="center"
                                        key={`th-${label}`}>
                                        {label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemIds.map(id => (
                                <TableRow key={`tr-${id}`}>
                                    <TableCell style={stickyStyle}>
                                        {actions(id)}
                                    </TableCell>
                                    {props.map((prop: ItemProp, index: number) => (
                                        <TableCell
                                            align="right"
                                            style={{minWidth: 200}}
                                            key={`tr-${id}-${prop.data.key}-${index}`}>
                                            {render(items[id], prop)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            ))}
        </ArraySlice>
    )
};