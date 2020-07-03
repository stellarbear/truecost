import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    Tooltip,
} from "@material-ui/core";
import {AddCircle} from "@material-ui/icons";
import {useMutation} from "react-apollo";
import {ItemProp} from "./types";

import {getResolverName, parseQLErrors} from "auxiliary";
import {PaginationContext} from "./Pagination";
import {NotificationContext} from "components/wrappers";
import {Component} from "./types/ABase";

interface AddProps {
    def?: {};
    placement?: "top" | "bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" | "left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | undefined;
    title: string;
    props: ItemProp[];
    createItem: any;
    pack?: string;
}

const normalize = (item: {}): {} =>
    Object.keys(item).reduce((acc, cur) =>
        Array.isArray(item[cur])
            ? ({...acc, [cur]: item[cur].map((e: any) => e.id || e)})
            : cur.startsWith("_") ? acc : ({...acc, [cur]: item[cur]}), {});


const Add: React.FC<AddProps> =
    ({
         pack,
         title,
         props,
         def = {},
         createItem,
         placement,
     }): JSX.Element => {
        const {refetchQuery} = React.useContext(PaginationContext);
        const [open, setOpen] = React.useState(false);
        const [createItemMutation] = useMutation(createItem);
        const createResponse = getResolverName(createItem);
        const {notify} = React.useContext(NotificationContext);
        const [errors, setErrors] = React.useState<Record<string, any>>({});

        //console.log("props", props)
        const defaultState: any =
            {
                ...props.reduce((obj, prop) => Object.assign(obj, {[prop.key]: prop.def}), {}),
                ...def,
            };
        //console.log("defaultState", defaultState)

        const [data, setData] = React.useState(defaultState);
        const handleOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const onChange = (key: string, value: any) => {
            setData({...data, [key]: value});
            setErrors({});
        };

        const onAdd = async () => {
            try {
                const norm = normalize(data);
                const mutationVariables = pack == undefined ? {...norm} : {[pack]: {...norm}};
                console.log("mutation sent", {...mutationVariables});
                const response = await createItemMutation({variables: {...mutationVariables}});
                if (response && response.data && response.data[createResponse]) {
                    notify("new record was created");
                    handleClose();
                    await refetchQuery();

                    setData(defaultState);
                    setErrors({});
                } else {
                    notify("server has not responded");
                }
            } catch (e) {
                const errors = parseQLErrors(e);
                setErrors({...errors});
                notify("constrains failed");
            }
        };

        const buildListItem = (prop: ItemProp) => {
            const {key} = prop;
            const value = data[key];
            const id = defaultState.id || undefined;

            return prop.render({
                id,
                data,
                value,
                errors: errors[key] || [],
                component: Component.Add,
                onChange: (event: any) => onChange(key, event),
            });
        };

        return (
            <React.Fragment>
                <Tooltip title={title} placement={placement || "top"}>
                    <IconButton onClick={handleOpen}>
                        <AddCircle/>
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>{`Add new ${title}`}</DialogTitle>
                    <DialogContent dividers={true}>
                        {open && <List>
                            {props.map((prop: ItemProp) => (
                                <ListItem key={`add-${prop.key}`}>
                                    {buildListItem(prop)}
                                </ListItem>
                            ))}
                        </List>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">Cancel</Button>
                        <Button disabled={Object.keys(errors).length > 0} onClick={onAdd} color="primary">Add</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    };

export default Add;
