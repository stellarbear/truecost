import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import Markdown from "./Markdown";

interface EditorPostProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}

const EditorPost: React.FC<EditorPostProps> = ({
                                                   value = "",
                                                   label = "post",
                                                   onChangeEvent = () => {
                                                   },
                                               }) => {
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
                <DialogTitle>{"Verification code"}</DialogTitle>
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
                    label={label}
                    style={{minWidth: 300}}
                    variant="filled"
                    value={text.slice(0, 1600) + "..."}
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

export default EditorPost;
