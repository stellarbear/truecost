import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
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
import {IRange, IRangeData, rangeBase} from "@truecost/shared";
import {Col, Row} from "pages/Base/Grid";
import {SwitchField} from "./SwitchField";
import {NumericField} from "./NumericField";

interface EditorMarkProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}


const preview = (data: IRange) => data.d.length > 0 ? (
    "mode: " + (data.o ? "single" : "double") + "\n" +
    "step: " + data.s + "\n" +
    "-----------" + "\n" +
    data.d.map(({a: at, p: price, m: mark, e: eta}) => `${at}: ${price} - ${mark} (${eta || 0})`).join('\n')
) : "-";

const EditorRange: React.FC<EditorMarkProps> = (props) => {
    const {
        value = JSON.stringify(rangeBase),
        label = "range",
        onChangeEvent = () => {
        },
    } = props;
    const [state, setState] = useState<IRange>(rangeBase);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const parsed = SafeJSON.parse(value, rangeBase);
        parsed.d.sort((a, b) => a.a - b.a);
        setState(parsed);
    }, [value]);

    const updateData = (d: IRangeData[]) =>
        setState({...state, d});

    const addNewRow = () => updateData([...state.d, {
        a: 0,
        p: 0,
        e: 0,
        m: "mark",
    }]);

    const renderRow = (index: number) => {
        const {a: at, p: price, m: mark, e: eta} = state.d[index];

        return (
            <Col key={index}>
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
                                const currValue = state.d[index];
                                currValue.a = parseInt(event.target.value, 10) || 0;

                                updateData([...state.d.slice(0, index), currValue, ...state.d.slice(index + 1)]);
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
                                const currValue = state.d[index];
                                currValue.p = parseInt(event.target.value, 10) || 0;

                                updateData([...state.d.slice(0, index), currValue, ...state.d.slice(index + 1)]);
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
                                const currValue = state.d[index];
                                currValue.m = event.target.value;

                                updateData([...state.d.slice(0, index), currValue, ...state.d.slice(index + 1)]);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            label="eta"
                            value={eta || 0}
                            fullWidth
                            variant="filled"
                            onChange={(event) => {
                                const currValue = state.d[index];
                                currValue.e = parseInt(event.target.value, 10) || 0;

                                updateData([...state.d.slice(0, index), currValue, ...state.d.slice(index + 1)]);
                            }}
                        />
                    </TableCell>
                    <TableCell>
                        <IconButton
                            disabled={index !== state.d.length - 1}
                            onClick={() => updateData([...state.d.slice(0, index), ...state.d.slice(index + 1)])}>
                            <Delete />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </Col>
        );
    };

    const renderTable = () => {
        if (state.d.length === 0) {
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
                    {state.d.map((_, i) => renderRow(i))}
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
                    <Col s={8}>
                        <Row s={8} align="center">
                            <Typography>Step: </Typography>
                            <NumericField
                                min={1}
                                max={10000}
                                value={state.s}
                                onChangeEvent={(s) => setState({...state, s})}
                            />
                        </Row>
                        <Divider />
                        <Row s={16} align="center">
                            <Typography>Mode: </Typography>
                            <SwitchField
                                value={state.o}
                                prefix={"double"}
                                suffix={"single"}
                                onChangeEvent={(o) => setState({...state, o})}
                            />
                        </Row>
                        <Divider />
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

export default EditorRange;
