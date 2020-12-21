import React, {useEffect, useState} from "react";
import {
    Button,
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
    Typography,
} from "@material-ui/core";
import {SafeJSON} from "auxiliary/json";
import AddCircle from "@material-ui/icons/AddCircle";
import Delete from "@material-ui/icons/Delete";
import {Col} from "pages/Base/Grid";

interface IProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}

interface IShape {
    amount: number;
    quantity: number;
    name: string;
    description: string;
}


const preview = (data: IShape[]) =>
    data.length > 0
        ? data.map(({amount, name}) => `${name} (${amount} cur.)`).join('\n')
        : "-";

const defaultValue: IShape[] = [];
export const EditorItems: React.FC<IProps> = (props) => {
    const {
        value = JSON.stringify(defaultValue),
        label = "items",
        onChangeEvent = () => {
        },
    } = props;
    const [state, setState] = useState<IShape[]>(defaultValue);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const parsed = SafeJSON.parse(value, defaultValue);
        setState(parsed);
    }, [value]);

    const addNewRow = () => setState([...state, {
        amount: 0,
        quantity: 0,
        name: "",
        description: "",
    }]);

    const renderRow = (index: number) => {
        const {quantity, amount, name, description} = state[index];

        return (
            <Col key={index}>
                <TableRow key={index}>
                    <TableCell>
                        <TextField
                            label="quantity"
                            value={quantity}
                            inputProps={{
                                style: {textAlign: "center"},
                                min: 0,
                            }}
                            variant="filled"
                            onChange={(event) => {
                                const currValue = state[index];
                                currValue.quantity = parseInt(event.target.value, 10) || 0;
                                setState([...state]);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="amount"
                            value={amount}
                            inputProps={{
                                style: {textAlign: "center"},
                                min: 0,
                            }}
                            variant="filled"
                            onChange={(event) => {
                                const currValue = state[index];
                                currValue.amount = parseInt(event.target.value, 10) || 0;
                                setState([...state]);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="name"
                            value={name}
                            fullWidth
                            variant="filled"
                            onChange={(event) => {
                                const currValue = state[index];
                                currValue.name = event.target.value;
                                setState([...state]);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="description"
                            value={description}
                            fullWidth
                            variant="filled"
                            onChange={(event) => {
                                const currValue = state[index];
                                currValue.description = event.target.value;
                                setState([...state]);
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
            </Col>
        );
    };

    const renderTable = () => {
        if (state.length === 0) {
            return (
                <div>
                    <Typography>Item array is empty</Typography>
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
                style={{minWidth: 1050}}
            >
                <DialogTitle>{label}</DialogTitle>
                <DialogContent
                    style={{maxHeight: 500}}>
                    <Col s={8}>
                        {renderTable()}
                    </Col>
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
