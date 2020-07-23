import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Typography,
    Paper,
} from "@material-ui/core";
import {useMutation} from "react-apollo";
import React, {useCallback, useEffect} from "react";

import gql from "graphql-tag";
import {Link, withRouter} from "react-router-dom";
import {RouteComponentProps, useHistory} from "react-router";
import Meta from "pages/Base/Meta";
import {DataContext} from "pages/Data/Wrapper";
import Alert from "@material-ui/lab/Alert";
import {useForm} from "react-hook-form";
import {validate} from "@truecost/shared";
import {theme} from "theme";
import {Col, Row} from "pages/Base/Grid";


const LOGIN = gql`
    mutation UserLogin($email: String!, $password: String!) {
        UserLogin(email:$email, password:$password) {
            name
            role
            email
            id
        }
    }
`;

//TODO: account disabled error&&&&????

interface LogInSubmit {
    email: string;
    password: string;
}

export const Login: React.FC = () => {
    const history = useHistory();
    const {update: {setUser}} = React.useContext(DataContext);
    const [loginMutation, {data, error, loading}] = useMutation(LOGIN);

    const {register, handleSubmit, errors} = useForm<LogInSubmit>({reValidateMode: "onBlur"});

    const logInSubmit = useCallback(
        (data: LogInSubmit) => {
            loginMutation({variables: data});
        },
        [],
    );

    useEffect(() => {
        if (data?.UserLogin) {
            setUser(data.UserLogin);
            history.push(`/`);
        }
    }, [data?.UserLogin]);


    return (
        <Container maxWidth="xs">
            <form style={{margin: theme.spacing(1)}} onSubmit={handleSubmit(logInSubmit)}>
                <Paper>
                    <Col fullWidth p={16}>
                        <Col fullWidth>
                            <TextField
                                fullWidth
                                inputRef={register({
                                    required: "This field is required",
                                    pattern: {
                                        value: validate("email").regex,
                                        message: "Does not look like email (:",
                                    },
                                })}
                                name={"email"}
                                label="Email *"
                                error={!!errors.email?.message}
                                helperText={errors.email?.message || " "}
                                variant="filled"
                            />
                            <TextField
                                fullWidth
                                inputRef={register({
                                    required: "This field is required",
                                    minLength: {
                                        value: 3,
                                        message: "At least 3 chars",
                                    },
                                })}
                                name={"password"}
                                label="Password *"
                                error={!!errors.password?.message}
                                helperText={errors.password?.message || " "}
                                variant="filled"
                            />
                            <Button fullWidth variant="contained" type="submit">
                                {loading ? <CircularProgress size={24}/> : "LOGIN"}
                            </Button>
                        </Col>
                    </Col>
                </Paper>
                <Box mt={2}>
                    {error && <Alert severity="error">{error.message}</Alert>}
                </Box>
            </form>
        </Container>
    );
};
