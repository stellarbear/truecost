import React, {useEffect, useState} from "react";
import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Theme,
    Typography,
    withStyles,
} from "@material-ui/core";
import {SafeJSON} from "auxiliary/json";
import {AddCircle, Delete} from "@material-ui/icons";

interface IState {
    at: number;
    price: number
    mark: string;
}

interface EditorMarkProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}


const preview = (data: IState[]) =>
    data.map(({at, price, mark}) => `${at}: ${price} - ${mark}`).join('\n')

const EditorRange: React.FC<EditorMarkProps> = (props) => {
    const {
        value = "[]",
        label = "range",
        onChangeEvent = () => {},
    } = props;
    const [state, setState] = useState<IState[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setState(SafeJSON.parse(value, [])
            .sort((a: IState, b: IState) => a.at - b.at));
    }, [value]);

    const addNewRow = () => setState([...state, {
        at: 0,
        price: 0,
        mark: "mark"
    }])

    const renderRow = (index: number) => {
        const {at, price, mark} = state[index];

        return (
            <TableRow key={index}>
                <TableCell>
                    <TextField
                        label="at"
                        value={at}
                        fullWidth
                        inputProps={{
                            style: {textAlign: "center"},
                            min: 0,
                        }}
                        variant="filled"
                        onChange={(event) => {
                            const currValue = state[index];
                            currValue.at = parseInt(event.target.value, 10) || 0;

                            setState([...state.slice(0, index), currValue, ...state.slice(index + 1)]);
                        }}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        label="price"
                        value={price}
                        fullWidth
                        inputProps={{
                            style: {textAlign: "center"},
                            min: 0,
                        }}
                        variant="filled"
                        onChange={(event) => {
                            const currValue = state[index];
                            currValue.price = parseInt(event.target.value, 10) || 0;

                            setState([...state.slice(0, index), currValue, ...state.slice(index + 1)]);
                        }}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        label="mark"
                        value={mark}
                        fullWidth
                        variant="filled"
                        onChange={(event) => {
                            const currValue = state[index];
                            currValue.mark = event.target.value;

                            setState([...state.slice(0, index), currValue, ...state.slice(index + 1)]);
                        }}
                    />
                </TableCell>
                <TableCell>
                    <IconButton
                        disabled={index !== state.length - 1}
                        onClick={() => setState([...state.slice(0, index), ...state.slice(index + 1)])}>
                        <Delete />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    };

    const renderTable = () => {
        if (state.length === 0) {
            return (
                <div>
                    <Typography>Range is empty</Typography>
                    <Typography variant="caption">Add new row by pressing the button below</Typography>
                </div>
            );
        }

        return (
            <Table size="small">
                <TableBody>
                    {state.map((_, i) => renderRow(i))}
                </TableBody>
            </Table>
        );
    };

    const renderDialog = () => {
        return (
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>{label}</DialogTitle>
                <DialogContent
                    style={{minWidth: 550, maxHeight: 500}}>
                    {renderTable()}
                </DialogContent>
                <DialogActions style={{
                    display: 'flex',
                    justifyContent: "space-between",
                }}>
                    <IconButton
                        onClick={() => addNewRow()}>
                        <AddCircle color="primary" />
                    </IconButton>
                    <Button
                        onClick={() => {
                            onChangeEvent(JSON.stringify(state));
                            setOpen(false);
                        }}
                        color="primary" variant="contained">
                        Update
                        </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <React.Fragment>
            <TextField
                style={{minWidth: 300}}
                label={label}
                fullWidth
                variant="filled"
                value={preview(state)}
                multiline
                rowsMax={4}
                onClick={() => setOpen(true)} />
            {renderDialog()}
        </React.Fragment>
    );
};

export default EditorRange;