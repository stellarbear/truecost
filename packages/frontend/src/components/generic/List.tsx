import {
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";
import React, {useEffect} from "react";
import Save from "@material-ui/icons/Save";
import Cancel from "@material-ui/icons/Cancel";
import Delete from "@material-ui/icons/Delete";
import {ItemProp} from "./types";
import {getResolverName} from "auxiliary";

import {DocumentNode} from "graphql";
import {useNotification} from "components/wrappers/NotifyWrapper";
import {normalize} from "./normalize";
import {Row} from "pages/Base/Grid";
import {useLoading} from "components/wrappers/LoadingWrapper";
import {ArraySlice} from "./components/ArraySlice";
import {useShared} from "./CRUD";
import {InfoCard} from "pages/Base/InfoCard";
import {parseApolloError} from "auxiliary/error";
import {TimeoutButton} from "./components/TimeoutButton";
import {visible} from "./Visible";
import {arrayToDict} from "@truecost/shared";
import {useMutation, useQuery} from "@apollo/client";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

const stickyStyle: CSSProperties = {
    position: "sticky",
    left: 0,
    backgroundColor: "#FFFFFFDD",
    zIndex: 3,
};

type IItem = {id: string;[key: string]: any};
type IItems = Record<string, IItem>;
type IError = Record<string, Record<string, string>>;

interface UserListProps {
    title: string;
    propsList: ItemProp[];
    listQuery: DocumentNode;
    updateMutation: DocumentNode;
    removeMutation: DocumentNode;
}

export const List: React.FC<UserListProps> = (props) => {
    const {
        title,
        propsList,
        listQuery,
        updateMutation,
        removeMutation,
    } = props;
    const [share] = useShared();
    const {setLoading} = useLoading();
    const {notify} = useNotification();
    const [remove] = useMutation(removeMutation);
    const [update] = useMutation(updateMutation);
    const [items, setItems] = React.useState<IItems>({});
    const [clones, setClones] = React.useState<IItems>({});
    const [errors, setErrors] = React.useState<IError>({});
    const {renderVisible, propsFiltered} = visible({key: `list-${title}`, propsArray: propsList});

    const {data, refetch, loading} = useQuery(listQuery, {
        variables: {take: 0, skip: 0, input: normalize(share.vars)},
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        const listResponse = getResolverName(listQuery);
        if (data?.[listResponse]?.items) {
            const {items} = data[listResponse];

            console.log("query sent", normalize(share.vars));
            console.log("response received", items);

            const dict = arrayToDict<IItem>(items, "id");
            setItems({...dict});
            setClones({...dict});
        }
    }, [data]);

    const onTry = async (id: string, callback: () => Promise<boolean>) => {
        try {
            setLoading(true);
            if (await callback()) {
                await refetch();
            } else {
                notify("server not responded or data corrupted");
            }
        } catch (e) {
            const fail = parseApolloError(e).asRecord();
            setErrors({[id]: {...fail}});
            notify(`constrains failed`, fail);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: string) => {
        await onTry(id, async () => {
            console.log('trying delete', id);
            const response = await remove({variables: {input: {id}}});
            const name = getResolverName(removeMutation);

            if (response?.data?.[name]) {
                notify(`record ${id} was deleted`);
                return true;
            } else {
                return false;
            }
        });
    };

    const onUpdate = async (id: string) => {
        await onTry(id, async () => {
            console.log('trying sent', normalize(items[id]));
            const response = await update({variables: {input: normalize(items[id])}});
            const name = getResolverName(updateMutation);

            if (response?.data?.[name]) {
                notify(`record ${id} was updated`);
                return true;
            } else {
                return false;
            }
        });
    };

    const onChange = (id: string, key: string, value: any) => {
        const newItems = {...items, [id]: {...items[id], [key]: value}};
        setItems(newItems);
        setErrors({});
    };

    const onCancel = () => {
        setItems({...clones});
    };

    const render = (item: IItem, prop: ItemProp) => {
        const {data: {key}} = prop;

        return prop.renderList({
            id: item.id,
            value: item[key],
            error: errors?.[item.id]?.[key],
            state: item,
            onChange: (value: any) => onChange(item.id, key, value),
        } as any);
    };

    const actions = (id: string) => {
        const similar = JSON.stringify(items[id]) == JSON.stringify(clones[id]);

        return (
            <Row>
                <IconButton disabled={similar} onClick={() => onUpdate(id)}>
                    <Save />
                </IconButton>
                <IconButton disabled={similar} onClick={() => onCancel()}>
                    <Cancel />
                </IconButton>
                <TimeoutButton timeout={3} icon={<Delete />} onClickEvent={() => onDelete(id)} />
            </Row>
        );
    };

    if (loading) {
        return (
            <InfoCard
                //style={{height: "50vh"}}
                text={[
                    'Loading',
                    'Please, wait',
                ]}
                actions={[
                    <CircularProgress key="loading" color="inherit" size={40} />,
                ]} />
        );
    }

    return (
        <div style={{position: "relative"}}>
            <div style={{position: "absolute", right: 0}}>
                {renderVisible()}
            </div>
            <ArraySlice data={Object.keys(items)} chunk={3} prefix="admin-pagination">
                {(itemIds => (
                    <Paper style={{
                        overflowY: "visible",
                        overflowX: "auto",
                    }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={stickyStyle}>
                                        {"actions"}
                                    </TableCell>
                                    {propsFiltered.map(({data: {label}}) => (
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
                                        {propsFiltered.map((prop: ItemProp, index: number) => (
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
        </div>
    );
};
