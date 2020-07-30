import {
    Box,
    Button,
    CircularProgress,
    Container,
    TextField,
    Paper,
} from "@material-ui/core";
import {useMutation} from "react-apollo";
import React, {useCallback, useEffect} from "react";

import gql from "graphql-tag";
import {Link} from "react-router-dom";
import {useHistory} from "react-router";
import Alert from "@material-ui/lab/Alert";
import {useForm} from "react-hook-form";
import {validate} from "@truecost/shared";
import {theme} from "theme";
import {Col, Row} from "pages/Base/Grid";
import {parseApolloError} from "auxiliary/error";
import {useStore} from "pages/Data/Wrapper";
import {useLoading} from "components/wrappers/LoadingWrapper";


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
    const {setLoading} = useLoading();
    const {update: {setUser}} = useStore();
    const [loginMutation, {data, error, loading}] = useMutation(LOGIN);

    const {register, handleSubmit, errors, clearErrors} = useForm<LogInSubmit>({reValidateMode: "onBlur"});

    const logInSubmit = useCallback(
        async (data: LogInSubmit) => {
            try {
                clearErrors();
                setLoading(true);
                await loginMutation({variables: data});
            } catch (e) {} finally {
                setLoading(false);
            }
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
                                {loading ? <CircularProgress size={24} /> : "LOGIN"}
                            </Button>
                        </Col>
                    </Col>
                </Paper>
                <Box mt={2}>
                    {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
                </Box>
            </form>
            <Col p={[0, 16]} fullWidth>
                <Button fullWidth component={Link} to={"/password/forget"}>
                    Forgot password?
            </Button>
            </Col>
        </Container>
    );
};
