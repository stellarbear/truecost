import React, {useState} from "react";
import {IconButton, InputAdornment, TextField, Typography} from "@material-ui/core";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {BaseTextFieldProps} from "@material-ui/core/TextField";

interface IPasswordFieldProps extends BaseTextFieldProps {
    rtl?: boolean;
    hideInput?: boolean;
    showInfo?: boolean;
    onChangeEvent: ((value: string) => void);
}

const PasswordField = ({
                           rtl = false,
                           onChangeEvent,
                           showInfo = true,
                           hideInput = true,
                           ...rest
                       }: IPasswordFieldProps): JSX.Element => {
    const [visibility, setVisibility] = useState(false);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const {value} = event.target;
        onChangeEvent(value);
    };

    const value: string = rest.value as string;

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
            <TextField
                {...rest}
                fullWidth
                variant="filled"
                onChange={onInputChange}
                type={(visibility ? "text" : "password")}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position={rtl ? "start" : "end"}>
                            <IconButton
                                tabIndex={-1}
                                onClick={(): void => setVisibility(!visibility)}
                            >
                                {visibility ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {showInfo ? (
                <React.Fragment>
                    <Typography variant="caption" style={{opacity: value.length >= 8 ? 1.0 : 0.4}}>at least 8 chars
                        long</Typography>
                    <Typography variant="caption" style={{opacity: value.match(/[A-Z]/g) !== null ? 1.0 : 0.4}}>uppercase
                        (A-Z)</Typography>
                    <Typography variant="caption" style={{opacity: value.match(/[a-z]/g) !== null ? 1.0 : 0.4}}>lowercase
                        (a-z)</Typography>
                    <Typography variant="caption" style={{opacity: value.match(/[0-9]/g) !== null ? 1.0 : 0.4}}>digits
                        (0-9)</Typography>
                </React.Fragment>
            ) : null
            }
        </div>
    );
};

export default PasswordField;
