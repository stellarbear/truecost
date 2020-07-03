import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    TextField,
    Typography,
} from "@material-ui/core";
import {useMutation} from "react-apollo";
import React, {useCallback, useEffect} from "react";

import gql from "graphql-tag";
import {Link, withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import Meta from "pages/Base/Meta";
import {DataContext} from "pages/Base/DataWrapper";
import Alert from "@material-ui/lab/Alert";
import {useForm} from "react-hook-form";
import {validate} from "@truecost/shared";
import {theme} from "theme";


const LOGIN = gql`
    mutation($email: String!, $password: String!) {
        UserLogin(email:$email, password:$password) {
            name
            role
            email
            id
        }
    }
`;

interface LogInSubmit {
    email: string;
    password: string;
}

type LoginProps = RouteComponentProps;

const Login: React.FC<LoginProps> = ({history}) => {
    const {store: {user: {updateUser}}} = React.useContext(DataContext);
    const [loginMutation, {data, error, loading}] = useMutation(LOGIN);

    const {register, handleSubmit, errors, setError, watch} = useForm<LogInSubmit>({reValidateMode: "onBlur"});

    const logInSubmit = useCallback(
        (data: LogInSubmit) => {
            loginMutation({variables: data});
        },
        [],
    );

    useEffect(() => {
        if (data?.UserLogin) {
            updateUser(data.UserLogin);
            history.push(`/`);
        }
    }, [data?.UserLogin]);


    return (
        <>
            <Meta page="login"/>
            <Container maxWidth="xs">
                <form style={{margin: theme.spacing(1)}} onSubmit={handleSubmit(logInSubmit)}>
                    <Typography variant="h5" gutterBottom>Log in</Typography>
                    <Card>
                        <CardContent>
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
                        </CardContent>
                        <CardActions>
                            <Button component={Link} to="/user/forget" style={{marginRight: 8}}>
                                forgot password?
                            </Button>
                            <Button variant="contained" type="submit">
                                {loading ? <CircularProgress size={24}/> : "LOGIN"}
                            </Button>
                        </CardActions>
                    </Card>
                    <Box mt={2}>
                        {error && <Alert severity="error">{error.message}</Alert>}
                    </Box>
                </form>
            </Container>
        </>

    );
};

export default withRouter(Login);
