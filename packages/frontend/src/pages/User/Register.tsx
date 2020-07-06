import {Button, CircularProgress, IconButton, TextField, Typography} from "@material-ui/core";
import {useMutation} from "react-apollo";
import React, {useState} from "react";

import gql from "graphql-tag";
import {AccountCircle, Refresh} from "@material-ui/icons";
import {ErrorLabel, InputField} from "components";
import {parseQLErrors} from "auxiliary";
import PasswordField from "components/PasswordField";
import {generateCaptcha} from "auxiliary/captcha";
import {DistortionText} from "captcha/DistortionText";
import {validateEmail, validatePassword} from "auxiliary/validate";
import {Link, withRouter} from "react-router-dom";
import Meta from "pages/Base/Meta";

const REGISTER = gql`
    mutation userCreate($name: String!, $password: String!, $email: String!) {
        userCreate(name:$name, password:$password, email:$email)
    }
`;

interface IData {
    captcha: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const defaultData: IData = {
    email: "",
    captcha: "",
    password: "",
    confirmPassword: "",

    name: "",
};

const Register: React.FC = () => {
    const [sent, setSent] = useState(false);
    const [registerMutation, {loading}] = useMutation(REGISTER);

    const [captcha, setCaptcha] = useState<string | null>(generateCaptcha());
    const [state, setState] = useState<IData>({...defaultData});
    const [errors, setErrors] = useState<IData>({...defaultData});

    const onChange = (propName: keyof IData, value: string | boolean): void => {
        const newState = {...state, [propName]: value};
        setState(newState);
    };

    const validate = (): boolean => {
        const newErrors = {...defaultData};
        const {email, password, confirmPassword, name, captcha: stateCaptcha} = state;
        if (!name) {
            newErrors.name = "must not be empty";
        }
        if (!email) {
            newErrors.email = "must not be empty";
        }
        if (!password) {
            newErrors.password = "must not be empty";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "must not be empty";
        }
        if (!validateEmail(email)) {
            newErrors.email = "invalid email format";
        }
        if (password != confirmPassword) {
            newErrors.confirmPassword = "passwords do not match";
        }
        if (!validatePassword(password)) {
            newErrors.password = "password does not meet the requirements";
        }
        if (captcha != stateCaptcha) {
            newErrors.captcha = "wrong captcha";
        }
        setErrors(newErrors);

        return (Object.values(newErrors).join("").length === 0);
    };

    const onRegister = async (): Promise<void> => {
        if (loading || !validate()) {
            return;
        }

        const data = {...state};
        delete data.confirmPassword;
        delete data.captcha;

        try {
            await registerMutation({variables: {...data}});
            setSent(true);
        } catch (error) {
            const QLErrors = parseQLErrors(error);
            setErrors({...defaultData, ...QLErrors});
        }
    };

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            <Meta page="register"/>
            {sent ? (
                <React.Fragment>
                    <Typography style={{marginTop: 64}}>User was succesfully created</Typography>
                    <Typography>Confirmation link will be sent in a moment</Typography>
                    <Button component={Link} style={{marginTop: 16}} to="/login">Go to login page</Button>
                </React.Fragment>
            ) : (
                <div style={{width: "fit-content"}}>
                    <ErrorLabel error={errors.name}>
                        <InputField label={"name"} value={state.name}
                                    onChangeEvent={(value: string): void => onChange("name", value)}
                                    adornment={<AccountCircle/>}/>
                    </ErrorLabel>
                    <ErrorLabel error={errors.email}>
                        <InputField label={"email"} value={state.email}
                                    onChangeEvent={(value: string): void => onChange("email", value)}
                                    adornment={<AccountCircle/>}/>
                    </ErrorLabel>

                    <ErrorLabel error={errors.password}>
                        <PasswordField label={"password"} value={state.password}
                                       onChangeEvent={(value: string): void => onChange("password", value)}/>
                    </ErrorLabel>
                    <ErrorLabel error={errors.confirmPassword}>
                        <PasswordField showInfo={false} label={"confirm password"} value={state.confirmPassword}
                                       onChangeEvent={(value: string): void => onChange("confirmPassword", value)}/>
                    </ErrorLabel>
                    <ErrorLabel error={errors.captcha}>
                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <TextField
                                variant="filled"
                                label={"Captcha"}
                                value={state.captcha}
                                onChange={(event) => onChange("captcha", event.target.value)}
                            />
                            <div style={{width: 160, margin: "0px 8px"}}>
                                <DistortionText fontSize={30} text={captcha}/>
                            </div>
                            <IconButton onClick={() => setCaptcha(generateCaptcha())}>
                                <Refresh/>
                            </IconButton>
                        </div>
                    </ErrorLabel>

                    <Button variant="contained" onClick={() => onRegister()} style={{marginTop: 16}}>
                        {loading ? <CircularProgress size={24}/> : "REGISTER"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default withRouter(Register);
