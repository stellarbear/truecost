import {Link} from "react-router-dom";
import {useMutation} from "react-apollo";
import {gql} from "apollo-boost";
import React, {useState} from "react";
import {Button, CircularProgress, IconButton, TextField, Typography} from "@material-ui/core";
import {ErrorLabel, InputField} from "components";
import {AccountCircle, Refresh} from "@material-ui/icons";
import {generateCaptcha} from "auxiliary/captcha";
import {DistortionText} from "captcha";
import {validateEmail} from "auxiliary/validate";
import Meta from "pages/Base/Meta";

interface IForgetProps {
}

const ForgetRequest = gql`
    mutation ($email: String!) {
        userForget(email: $email)
    }
`;

interface IData {
    captcha: string;
    email: string;
}

const defaultData: IData = {
    email: "",
    captcha: "",
};

const Forget: React.FC<IForgetProps> = ({}) => {
    const [captcha, setCaptcha] = React.useState<string | null>(generateCaptcha());

    const [sent, setSent] = useState(false);
    const [forgetMutation] = useMutation(ForgetRequest);
    const [isForgetting, setIsForgetting] = useState(false);

    const [state, setState] = React.useState<IData>({...defaultData});
    const [errors, setErrors] = React.useState<IData>({...defaultData});

    const onChange = (propName: keyof IData, value: string | boolean): void => {
        const newState = {...state, [propName]: value};
        setState(newState);
    };

    const validate = (): boolean => {
        const newErrors = {...defaultData};
        const {email, captcha: stateCaptcha} = state;
        if (!email) {
            newErrors.email = "must not be empty";
        }
        if (!validateEmail(email)) {
            newErrors.email = "invalid email format";
        }
        if (captcha != stateCaptcha) {
            newErrors.captcha = "wrong captcha";
        }
        setErrors(newErrors);

        return (Object.values(newErrors).join("").length === 0);
    };

    const forgetRequest = async () => {
        if (!validate()) {
            return;
        }

        setIsForgetting(true);
        await forgetMutation({variables: {email: state.email}});
        setSent(true);
    };

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            <Meta page="forget"/>
            {sent ? (
                <React.Fragment>
                    <Typography style={{marginTop: 64}}>Password reset link was sent to email</Typography>
                    <Typography>Note: only last request link will be valid</Typography>
                    <Button component={Link} to="/login" style={{marginTop: 16}}>Go to login page</Button>
                </React.Fragment>
            ) : (
                <div style={{width: "fit-content"}}>
                    <ErrorLabel error={errors.email}>
                        <InputField label={"email *"} value={state.email}
                                    onChangeEvent={(value) => onChange("email", value)}
                                    adornment={<AccountCircle/>}/>
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

                    <Button variant="contained" onClick={() => forgetRequest()} style={{marginTop: 16}}>
                        {isForgetting ? <CircularProgress size={24}/> : "reset password"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Forget;
