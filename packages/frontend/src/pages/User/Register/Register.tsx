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
import {Col} from "pages/Base/Grid";
import {parseApolloError} from "auxiliary/error";
import {useLoading} from "components/wrappers/LoadingWrapper";


const registerMutation = gql`
    mutation UserCreate($name: String!, $email: String!, $password: String!) {
        UserCreate(name: $name, email:$email, password:$password)
    }
`;

interface RegisterSubmit {
    name: string;
    email: string;
    password: string;
}

export const Register: React.FC = () => {
    const history = useHistory();
    const {setLoading} = useLoading();
    const [mutation, {data, error, loading}] = useMutation(registerMutation);

    const {register, handleSubmit, errors, setError, clearErrors} = useForm<RegisterSubmit>({reValidateMode: "onBlur"});

    const RegisterSubmit = useCallback(
        async (data: RegisterSubmit) => {
            try {
                clearErrors();
                setLoading(true);
                await mutation({variables: {...data}});
            } catch (e) {
                const errors = parseApolloError(e);
                Object.keys(errors).map(key => setError(key as any, errors[key]));
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (data?.UserCreate) {
            if (data.UserCreate) {
                history.push(`/register/message`);
            } else {
                debugger;
            }
        }
    }, [data?.UserCreate]);


    return (
        <Container maxWidth="xs">
            <form style={{margin: theme.spacing(1)}} onSubmit={handleSubmit(RegisterSubmit)}>
                <Paper>
                    <Col fullWidth p={16}>
                        <Col fullWidth>
                            <TextField
                                fullWidth
                                inputRef={register()}
                                name={"name"}
                                label="Username"
                                placeholder="not required"
                                error={!!errors.name?.message}
                                helperText={errors.name?.message || " "}
                                variant="filled"
                            />
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
                        </Col>
                        <Button fullWidth variant="contained" type="submit">
                            {loading ? <CircularProgress size={24} /> : "REGISTER"}
                        </Button>
                    </Col>
                </Paper>
                <Box mt={2}>
                    {error && <Alert severity="error">{error.message}</Alert>}
                </Box>
            </form>
        </Container>

    );
};
