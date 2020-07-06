import {Link, Redirect, RouteComponentProps, withRouter} from "react-router-dom";
import {useMutation} from "react-apollo";
import {gql} from "apollo-boost";
import React, {useState} from "react";
import {Button, CircularProgress, Typography} from "@material-ui/core";
import {validatePassword} from "auxiliary/validate";
import {ErrorLabel, PasswordField} from "components";
import Meta from "pages/Base/Meta";

interface IMatchProps {
    id: string;
    session: string;
}

type IConfirmProps = RouteComponentProps<IMatchProps>;

const ResetUser = gql`
    mutation userReset ($id: String!, $reset: String!, $password: String!) {
        userReset(id: $id, reset: $reset, password:$password)
    }
`;

interface IData {
    password: string;
    confirmPassword: string;
}

const defaultData: IData = {
    password: "",
    confirmPassword: "",
};

const Reset: React.FC<IConfirmProps> = ({
                                            match: {params: {id, session}},
                                        }) => {
    if (!id || !session) {
        return <Redirect to={"home"}/>;
    }

    const [sent, setSent] = useState(false);
    const [resetMutation] = useMutation(ResetUser);
    const [isResetting, setIsResetting] = useState(false);

    const [state, setState] = React.useState<IData>({...defaultData});
    const [errors, setErrors] = React.useState<IData>({...defaultData});

    const onChange = (propName: keyof IData, value: string | boolean): void => {
        const newState = {...state, [propName]: value};
        setState(newState);
    };

    const validate = (): boolean => {
        const newErrors = {...defaultData};
        const {password, confirmPassword} = state;
        if (!password) {
            newErrors.password = "must not be empty";
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "must not be empty";
        }
        if (password != confirmPassword) {
            newErrors.confirmPassword = "passwords do not match";
        }
        if (!validatePassword(password)) {
            newErrors.password = "password does not meet the requirements";
        }

        setErrors(newErrors);

        return (Object.values(newErrors).join("").length === 0);
    };

    const resetUser = async () => {
        if (!validate()) {
            return;
        }

        setIsResetting(true);
        await resetMutation({variables: {id, reset: session, password: state.password}});
        setSent(true);
    };

    return (
        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
            <Meta page="reset"/>
            {sent ? (
                <React.Fragment>
                    <Typography style={{marginTop: 64}}>Password was reset</Typography>
                    <Typography>Warning: if you will reset password too many times, you account may be
                        blocked</Typography>
                    <Button component={Link} style={{marginTop: 16}} to="/login">Go to login page</Button>
                </React.Fragment>
            ) : (
                <div style={{width: "fit-content"}}>
                    <ErrorLabel error={errors.password}>
                        <PasswordField label={"password*"} value={state.password}
                                       onChangeEvent={(value) => onChange("password", value)}/>
                    </ErrorLabel>
                    <ErrorLabel error={errors.confirmPassword}>
                        <PasswordField showInfo={false} label={"confirm password*"} value={state.confirmPassword}
                                       onChangeEvent={(value) => onChange("confirmPassword", value)}/>
                    </ErrorLabel>
                    <Button variant="contained" onClick={() => resetUser()} style={{marginTop: 16}}>
                        {isResetting ? <CircularProgress size={24}/> : "update password"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default withRouter(Reset);
