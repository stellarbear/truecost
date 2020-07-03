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
    value: number;
    label: string;
}

interface EditorMarkProps {
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

const EditorMark: React.FC<EditorMarkProps> = ({
                                                   value = "[]",
                                                   label = "mark",
                                                   onChangeEvent = () => {
                                                   },
                                               }) => {
    const [state, setState] = useState<IState[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => setState(SafeJSON.parse(value, [])), [value]);

    const addNewRow = () => {
        if (state.length === 0) {
            setState([{
                value: 0,
                label: "",
            }]);
        } else {
            const lastIndex = state.length - 1;
            const lastEntry = state[lastIndex];
            setState([
                ...state.slice(0, lastIndex + 1),
                {
                    value: lastEntry.value + 1,
                    label: "",
                }]);
        }
    };

    const renderRow = (index: number) => {
        const {value, label} = state[index];
        const valueMin = index > 0 ? state[index - 1].value + 1 : -Infinity;
        const valueMax = index < state.length - 1 ? state[index + 1].value - 1 : +Infinity;

        return (
            <TableRow key={index}>
                <TableCellLow style={{paddingRight: 8}}>
                    <TextField
                        label="value"
                        value={value}
                        type="number"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            style: {textAlign: "center"},
                            min: '' + valueMin,
                            max: '' + valueMax,
                        }}
                        variant="filled"
                        onChange={(event) => {
                            const value = event.target.value;

                            const currValue = state[index];
                            currValue.value = parseInt(value, 10);

                            const newState = [...state.slice(0, index), currValue, ...state.slice(index + 1)];
                            setState(newState);
                        }}
                    />
                </TableCellLow>
                <TableCellLow style={{paddingRight: 8}}>
                    <TextField
                        label="label"
                        value={label}
                        fullWidth
                        inputProps={{
                            style: {textAlign: "center"},
                        }}
                        variant="filled"
                        onChange={(event) => {
                            const label = event.target.value;

                            const currValue = state[index];
                            currValue.label = label;

                            const newState = [...state.slice(0, index), currValue, ...state.slice(index + 1)];
                            setState(newState);
                        }}
                    />
                </TableCellLow>
                <TableCellLow>
                    <IconButton
                        disabled={index !== state.length - 1}
                        onClick={() => setState([...state.slice(0, index), ...state.slice(index + 1)])}>
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

    let preview = state.reduce((acc, {value, label}) => acc + `${value}: ${label} $\n`, "");
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
                    onClick={() => setOpen(true)}
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

export default EditorMark;
