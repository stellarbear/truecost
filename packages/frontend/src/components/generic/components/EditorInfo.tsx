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
import AddCircle from "@material-ui/icons/AddCircle";
import Delete from "@material-ui/icons/Delete";
import {Col} from "pages/Base/Grid";

interface IProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}

type IShape = [key: string, value: string];


const preview = (data: IShape[]) =>
    data.length > 0
        ? data.map(([key, value]) => `${key} - ${value}`).join('\n')
        : "-";

const defaultValue: IShape[] = [];
export const EditorInfo: React.FC<IProps> = (props) => {
    const {
        value = JSON.stringify(defaultValue),
        label = "info",
        onChangeEvent = () => { },
    } = props;
    const [state, setState] = useState<IShape[]>(defaultValue);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let result = defaultValue;
        try {
            const attempt = JSON.parse(value);
            result = Object.entries(attempt).map(([key, value]) => [key, value] as IShape);
        } catch { }

        setState(result);
    }, [value]);


    const addNewRow = () => setState([...state, [
        "", "",
    ]]);

    const renderRow = (index: number) => {
        const [key, value] = state[index];

        return (
            <Col key={index}>
                <TableRow >
                    <TableCell>
                        <TextField
                            label="key"
                            value={key}
                            fullWidth
                            variant="filled"
                            onChange={(event) => {
                                const currValue = state[index];
                                currValue[0] = event.target.value;
                                setState([...state]);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="value"
                            value={value}
                            fullWidth
                            variant="filled"
                            onChange={(event) => {
                                const currValue = state[index];
                                currValue[1] = event.target.value;
                                setState([...state]);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <IconButton
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
                    <Typography>Info object is empty</Typography>
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
                            const compact = state.reduce((acc, [key, value]) => ({
                                ...acc, [key]: value,
                            }), {});

                            onChangeEvent(JSON.stringify(compact));
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
