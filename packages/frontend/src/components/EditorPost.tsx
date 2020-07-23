import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Markdown from "./Markdown";

interface EditorPostProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}


const preview = (value: string, limit = 1600) =>
    value.length > limit
        ? value.slice(0, limit) + "..."
        : value


const EditorPost: React.FC<EditorPostProps> = (props) => {
    const {
        value = "",
        label = "post",
        onChangeEvent = () => {
        },
    } = props;
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => setText(value), [value]);

    const renderEditor = () => (
        <TextField
            multiline
            fullWidth
            label="Enter your text"
            variant="filled"
            value={text}
            onChange={(event) => setText(event.target.value)}
        />
    );

    const renderPreview = () => (
        <Markdown>
            {text}
        </Markdown>
    );

    const renderDialog = () => {
        return (
            <Dialog
                open={open}
                maxWidth={false}
                fullWidth={true}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>{label}</DialogTitle>
                <DialogContent style={{maxHeight: "75vh"}}>
                    <div style={{display: "flex"}}>
                        <div style={{width: "50%", margin: 8}}>{renderEditor()}</div>
                        <div style={{width: "50%", margin: 8}}>{renderPreview()}</div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onChangeEvent(text);
                            setOpen(false);
                        }}
                        style={{minWidth: 90}}
                        color="primary" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <React.Fragment>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <TextField
                    style={{minWidth: 300}}
                    label={label}
                    fullWidth
                    variant="filled"
                    value={preview(text)}
                    multiline
                    rowsMax={4}
                    onClick={() => setOpen(true)}/>
            </div>
            {renderDialog()}
        </React.Fragment>
    );
};

export default EditorPost;
