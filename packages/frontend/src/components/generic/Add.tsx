import * as React from "react";
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
    Typography,
    Drawer,
    Divider,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircle";
import {useMutation} from "react-apollo";
import {ItemProp} from "./types";

import {getResolverName, parseQLErrors} from "auxiliary";
import {PaginationContext} from "./Pagination";
import {NotificationContext} from "components/wrappers";
import {DocumentNode} from "graphql";
import {Col} from "pages/Base/Grid";
import {IBase} from "@truecost/shared";
import {normalize} from "./normalize";
import {useNotification} from "components/wrappers/NotifyWrapper";

interface AddProps {
    props: ItemProp[];
    mutation: DocumentNode;
}

const defaultState = (props: ItemProp[]) =>
    props.reduce((acc, cur) => Object.assign(acc, {[cur.data.key]: cur.data.base}), {});

type IState = Record<string, any>

export const Add: React.FC<AddProps> = ({
    props,
    mutation,
}) => {
    const [create] = useMutation(mutation);
    const {notify} = useNotification();

    const [error, setError] = React.useState<IState>({})
    const [state, setState] = React.useState<IState>(defaultState(props));
    const [drawer, setDrawer] = React.useState(false);

    const onStateChange = (newState: IState) => {
        setState(newState);
        setError({});
    }

    const onChange = (key: string, value: any) => {
        onStateChange({...state, [key]: value})
    };

    const onAdd = async () => {
        try {
            const response = await create({variables: {input: normalize(state)}});
            const resolverName = getResolverName(mutation);
            if (response?.data?.[resolverName]) {
                onStateChange(defaultState(props));
                notify(`entry created`);
                setDrawer(false);

                //TODO: refetch
            } else {
                notify("server not responded or data corrupted");
            }
        } catch (e) {
            const fail = parseQLErrors(e)
            setError({...fail});
            notify(`constrains failed`, fail);
        }
    };

    const render = (prop: ItemProp) => {
        const {data: {key}} = prop;

        return prop.renderAdd({
            value: state[key],
            error: error[key],
            state,
            onChange: (value: any) => onChange(key, value),
        } as any);
    };

    const table = () => (
        <Table size="small" style={{width: 'auto'}}>
            <TableBody>
                {props.map((prop, index) =>
                    <TableRow key={`${prop.data.key}-${index}`}>
                        <TableCell align="right">{prop.data.label}</TableCell>
                        <TableCell align="left" style={{width: '100%'}}>{render(prop)}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )

    return (
        <React.Fragment>
            <Button variant="contained" onClick={() => setDrawer(true)}>
                <Typography>Add record</Typography>
            </Button>
            <Drawer anchor={'right'} open={drawer} onClose={() => setDrawer(false)}>
                <Col s={16} fullWidth p={16}
                    style={{minWidth: 400}} >
                    <Divider />
                    {table()}
                    <Button variant="contained"
                        fullWidth color="primary"
                        onClick={() => onAdd()}>
                        Add record
                        </Button>
                </Col>
            </Drawer>
        </React.Fragment>
    );
};
