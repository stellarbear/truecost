import React, {useState} from "react";
import {IconButton, InputAdornment, TextField} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {TextFieldProps} from "@material-ui/core/TextField";

export const PasswordField: React.FC<TextFieldProps> = (props) => {
    const [showPass, setShowPass] = useState(false);

    return (
        <TextField
            {...props}
            type={showPass ? "default" : "password"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass(!showPass)}>
                            {showPass ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};
