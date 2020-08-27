import {
    Box,
    Button,
    CircularProgress,
    Container,
    TextField,
    Paper,
    Typography,
} from "@material-ui/core";
import React, {useCallback, useEffect} from "react";

import {useHistory} from "react-router";
import Alert from "@material-ui/lab/Alert";
import {useForm} from "react-hook-form";
import {validate} from "@truecost/shared";
import {theme} from "theme";
import {Col} from "pages/Base/Grid";
import {parseApolloError} from "auxiliary/error";
import {useLoading} from "components/wrappers/LoadingWrapper";
import {Meta} from "pages/Base/Meta";
import {gql, useMutation} from "@apollo/client";


const forgetMutation = gql`
    mutation PasswordForget($email: String!) {
        PasswordForget(email: $email)
    }
`;

interface ForgetSubmit {
    email: string;
}

export const PasswordForget: React.FC = () => {
    const history = useHistory();
    const {setLoading} = useLoading();
    const [mutation, {data, error, loading}] = useMutation(forgetMutation);

    const {register, handleSubmit, errors, clearErrors} = useForm<ForgetSubmit>({reValidateMode: "onBlur"});

    const ForgetSubmit = useCallback(
        async (data: ForgetSubmit) => {
            try {
                clearErrors();
                setLoading(true);
                await mutation({variables: {...data}});
            } catch (e) {} finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (data?.PasswordForget) {
            if (data.PasswordForget) {
                history.push(`/password/message`);
            } else {
            }
        }
    }, [data?.PasswordForget]);


    return (
        <>
            <Meta />
            <Container maxWidth="xs">
                <form style={{margin: theme.spacing(1)}} onSubmit={handleSubmit(ForgetSubmit)}>
                    <Paper>
                        <Col fullWidth p={16}>
                            <Col fullWidth>
                                <Typography variant="caption">Reset link will be sent to your email</Typography>
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
                            </Col>
                            <Button fullWidth variant="contained" type="submit">
                                {loading ? <CircularProgress size={24} /> : "reset password"}
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
