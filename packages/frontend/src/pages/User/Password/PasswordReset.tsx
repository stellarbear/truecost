import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {useParams, Redirect, useHistory} from 'react-router';
import {gql} from 'apollo-boost';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {useQuery, useLazyQuery, useMutation} from 'react-apollo';
import {Button, Box, CircularProgress, Container, Paper, TextField} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {Alert} from '@material-ui/lab';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {theme} from 'theme';
import {Col} from 'pages/Base/Grid';
import {parseApolloError} from 'auxiliary/error';
import {useCallback} from 'react';

const verifyMutation = gql`
    mutation PasswordReset($forget: String!, $value: String!, $password: String!) {
        PasswordReset(forget: $forget, value:$value, password:$password) {
            name
            role
            email
            id
        }
    }
`;

interface ResetSubmit {
    password: string;
}

export const PasswordReset: React.FC = () => {
    const history = useHistory();
    const {setLoading} = useLoading();
    const {forget, value} = useParams();
    const [mutation, {data, error, loading}] = useMutation(verifyMutation);

    const {register, handleSubmit, errors, clearErrors} = useForm<ResetSubmit>({reValidateMode: "onBlur"});

    const ResetSubmit = useCallback(
        async (data: ResetSubmit) => {
            try {
                clearErrors();
                setLoading(true);
                await mutation({variables: {...data, forget, value}});
            } catch (e) {} finally {
                setLoading(false);
            }
        },
        [],
    );

    React.useEffect(() => {
        if (data?.PasswordReset) {
            if (data.PasswordReset) {
                history.push(`/login`);
            } else {
                debugger;
            }
        }
    }, [data?.PasswordReset])


    if (!forget || !value) {
        return <Redirect to="/404" />
    }

    return (
        <Container maxWidth="xs">
            <form style={{margin: theme.spacing(1)}} onSubmit={handleSubmit(ResetSubmit)}>
                <Paper>
                    <Col fullWidth p={16}>
                        <Col fullWidth>
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
                            {loading ? <CircularProgress size={24} /> : "update password"}
                        </Button>
                    </Col>
                </Paper>
                <Box mt={2}>
                    {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
                </Box>
            </form>
        </Container>
    )
}
