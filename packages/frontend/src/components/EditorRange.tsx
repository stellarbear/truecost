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
    from: number;
    to: number;
    price: number;
}

interface EditorRangeProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}


const TableCellLow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: "center",
            padding: "4px 8px 4px 0px",
        },
    }),
)(TableCell);

const EditorRange: React.FC<EditorRangeProps> = ({
                                                     value = "[]",
                                                     label = "range",
                                                     onChangeEvent = () => {
                                                     },
                                                 }) => {
    const [state, setState] = useState<IState[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => setState(SafeJSON.parse(value, [])), [value]);

    const addNewRow = () => {
        if (state.length === 0) {
            setState([{
                from: 0,
                to: 1,
                price: 0,
            }]);
        } else {
            const lastIndex = state.length - 1;
            const lastEntry = state[lastIndex];
            setState([
                ...state.slice(0, lastIndex + 1),
                {
                    from: lastEntry.to,
                    to: lastEntry.to + 1,
                    price: lastEntry.price,
                }]);
        }
    };

    const renderRow = (index: number) => {
        const {from, to, price} = state[index];
        const fromCanEdit = true;
        const toCanEdit = index === state.length - 1;

        const fromMin = index > 0 ? state[index - 1].from + 1 : -Infinity;
        const fromMax = index < state.length - 1 ? state[index + 1].from - 1 : +Infinity;

        const toMin = state[index].from + 1;
        const toMax = +Infinity;

        return (
            <TableRow key={index}>
                <TableCellLow>
                    <TextField
                        label="from"
                        value={from}
                        type="number"
                        fullWidth
                        style={{opacity: fromCanEdit ? 1.0 : 0.4}}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: !fromCanEdit,
                        }}
                        inputProps={{
                            style: {textAlign: "center"},
                            min: '' + fromMin,
                            max: '' + fromMax,
                        }}
                        variant="filled"
                        onChange={(event) => {
                            const from = event.target.value;

                            if (index > 0) {
                                const prevValue = state[index - 1];
                                prevValue.to = parseInt(from, 10);
                                const currValue = state[index];
                                currValue.from = parseInt(from, 10);
                                currValue.to = currValue.to < currValue.from ? currValue.from : currValue.to;

                                const newState = [...state.slice(0, index - 1), prevValue, currValue, ...state.slice(index + 1)];
                                setState(newState);
                            } else {
                                const currValue = state[index];
                                currValue.from = parseInt(from, 10);
                                currValue.to = currValue.to < currValue.from ? currValue.from : currValue.to;

                                const newState = [currValue, ...state.slice(index + 1)];
                                setState(newState);
                            }

                        }}
                    />
                </TableCellLow>
                <TableCellLow>
                    <TextField
                        label="to"
                        value={to}
                        fullWidth
                        type="number"
                        style={{opacity: toCanEdit ? 1.0 : 0.4}}
                        InputProps={{
                            readOnly: !toCanEdit,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            style: {textAlign: "center"},
                            min: '' + toMin,
                            max: '' + toMax,
                        }}
                        variant="filled"
                        onChange={(event) => {
                            const to = event.target.value;

                            if (index === state.length - 1) {
                                const currValue = state[index];
                                currValue.to = parseInt(to, 10);

                                const newState = [...state.slice(0, index), currValue];
                                setState(newState);
                            }
                        }}
                    />
                </TableCellLow>
                <TableCellLow>
                    <TextField
                        label="price"
                        value={price}
                        type="number"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            style: {textAlign: "center"},
                        }}
                        variant="filled"
                        onChange={(event) => {
                            const price = event.target.value;

                            const currValue = state[index];
                            currValue.price = parseInt(price, 10);

                            const newState = [...state.slice(0, index), currValue, ...state.slice(index + 1)];
                            setState(newState);
                        }}
                    />
                </TableCellLow>
                <TableCellLow>
                    <IconButton
                        disabled={index !== state.length - 1}
                        onClick={() => setState(state.slice(0, state.length - 1))}>
                        <Delete/>
                    </IconButton>
                </TableCellLow>
            </TableRow>
        );
    };

    const renderTable = () => {
        if (state.length === 0) {
            return (
                <div>
                    <Typography>Rande is empty</Typography>
                    <Typography variant="caption">Add new row by pressing the button below</Typography>
                </div>
            );
        }

        return (
            <Table size="small" style={{}}>
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
                disableBackdropClick
                onClose={() => setOpen(false)}
            >
                <DialogTitle>{label}</DialogTitle>
                <DialogContent
                    style={{minWidth: 550, maxHeight: 500}}>
                    {renderTable()}
                </DialogContent>
                <DialogActions>
                    <div style={{
                        display: 'flex',
                        width: "100%",
                        justifyContent: "space-between",
                    }}>
                        <IconButton
                            onClick={() => addNewRow()}>
                            <AddCircle color="primary"/>
                        </IconButton>
                        <Button
                            onClick={() => {
                                onChangeEvent(JSON.stringify(state));
                                setOpen(false);
                            }}
                            style={{minWidth: 90}}
                            color="primary" variant="contained">
                            Update
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    };

    let preview = state.reduce((acc, {from, to, price}) => acc + `${from}-${to}: ${price} $\n`, "");
    preview = preview.slice(0, preview.length - 1);

    return (
        <React.Fragment>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <TextField
                    label={label}
                    style={{minWidth: 300}}
                    variant="filled"
                    value={preview}
                    multiline
                    rowsMax={4}
                    InputProps={{
                        endAdornment: (
                            <Button
                                color="primary"
                                onClick={() => setOpen(true)}
                                style={{
                                    whiteSpace: "nowrap", position: "absolute",
                                    right: 36,
                                    bottom: 8,
                                }}>
                                Edit
                            </Button>
                        ),
                        readOnly: true,
                    }}/>
            </div>
            {renderDialog()}
        </React.Fragment>
    );
};

export default EditorRange;
