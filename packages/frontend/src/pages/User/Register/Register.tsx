import {Box, Button, CircularProgress, Container, Paper, TextField} from "@material-ui/core";
import React, {useCallback, useEffect} from "react";

import {gql, useMutation} from "@apollo/client";
import {useHistory} from "react-router";
import Alert from "@material-ui/lab/Alert";
import {useForm} from "react-hook-form";
import {validate} from "@truecost/shared";
import {theme} from "theme";
import {Col} from "pages/Base/Grid";
import {parseApolloError} from "auxiliary/error";
import {useLoading} from "components/wrappers/LoadingWrapper";
import {PasswordField} from "components/PasswordField";
import {Meta} from "pages/Base/Meta";


const registerMutation = gql`
    mutation UserCreate($email: String!, $password: String!, $name: String) {
        UserCreate(email:$email, password:$password, name: $name)
    }
`;

interface RegisterSubmit {
    name?: string;
    email: string;
    password: string;
}

export const Register: React.FC = () => {
    const history = useHistory();
    const {setLoading} = useLoading();
    const [mutation, {data, error, loading}] = useMutation(registerMutation);

    const {register, handleSubmit, errors, clearErrors} = useForm<RegisterSubmit>({reValidateMode: "onBlur"});

    const RegisterSubmit = useCallback(
        async (data: RegisterSubmit) => {
            try {
                clearErrors();
                setLoading(true);
                await mutation({variables: {...data}});
            } catch (e) {
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
            }
        }
    }, [data?.UserCreate]);


    return (
        <>
            <Meta />
            <Container maxWidth="xs">
                <form style={{margin: theme.spacing(1)}} onSubmit={handleSubmit(RegisterSubmit)}>
                    <Paper>
                        <Col p={16}>
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
                            <PasswordField
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
                                {loading ? <CircularProgress size={24} /> : "REGISTER"}
                            </Button>
                        </Col>
                    </Paper>
                    <Box mt={2}>
                        {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
                    </Box>
                </form>
            </Container>
        </>
    );
};
