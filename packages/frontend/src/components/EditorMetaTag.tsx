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
    name: string;
    content: string;
}

interface EditorMarkProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}


const preview = (data: IState[]) =>
    data.map(({name, content}) => `${name}: ${content}`).join('\n')

const EditorMetaTag: React.FC<EditorMarkProps> = (props) => {
    const {
        value = "{}",
        label = "meta",
        onChangeEvent = () => {},
    } = props;
    const [state, setState] = useState<IState[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const input: Record<string, string> = SafeJSON.parse(value, {});
        const data = Object.entries(input).map(([name, content]) => ({name, content}));
        setState(data);
    }, [value]);

    const addNewRow = () => setState([...state, {
        name: "",
        content: "",
    }])

    const renderRow = (index: number) => {
        const {name, content} = state[index];

        return (
            <TableRow key={index}>
                <TableCell>
                    <TextField
                        label="name"
                        value={name}
                        fullWidth
                        variant="filled"
                        onChange={(event) => {
                            const currValue = state[index];
                            currValue.name = event.target.value;

                            setState([...state.slice(0, index), currValue, ...state.slice(index + 1)]);
                        }}
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        label="content"
                        value={content}
                        fullWidth
                        variant="filled"
                        onChange={(event) => {
                            const currValue = state[index];
                            currValue.content = event.target.value;

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
                    <Typography>No meta tags present</Typography>
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
                            const data = state.reduce((acc, {name, content}) => {
                                acc[name] = content;
                                return acc;
                            }, {});
                            onChangeEvent(JSON.stringify(data));
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

export default EditorMetaTag;