import React, {useState} from "react";
import {SketchPicker} from 'react-color';
import {Row} from "pages/Base/Grid";
import {colors} from "theme";
import {ClickAwayListener, TextField} from "@material-ui/core";

interface EditorColorProps {
    value?: string;
    label?: string;
    onChangeEvent?: ((value: string) => void);
}

export const EditorColor: React.FC<EditorColorProps> = (props) => {
    const {
        value = "",
        label = "color",
        onChangeEvent = () => {
        },
    } = props;
    const [show, setShow] = useState(false);

    return (
        <Row s={8}>
            <div style={{
                width: 32, height: 32,
                backgroundColor: value ? value : colors.accentColor,
                borderRadius: "4px",
            }} />
            <TextField
                placeholder={label}
                onClick={() => setShow(true)}
                value={value || "deafult"}
            />
            {show && (
                <div style={{position: 'relative'}}>
                    <div style={{position: 'fixed', zIndex: 2}}>
                        <div
                            style={{top: '0px', right: '0px', bottom: '0px', left: '0px'}}
                        >
                            <ClickAwayListener onClickAway={() => setShow(false)}>
                                <SketchPicker
                                    color={value}
                                    onChangeComplete={(c) => onChangeEvent(c.hex)}
                                />
                            </ClickAwayListener>
                        </div>
                    </div>
                </div>
            )}
        </Row >
    );
};