import * as React from 'react';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {useStore} from 'pages/Data/Wrapper';
import {useForm} from 'react-hook-form';
import {Col, Row} from 'pages/Base/Grid';
import {TextField, Button, Box, Container, Paper, CircularProgress} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import {validate} from '@truecost/shared';
import {useQuery, useLazyQuery} from 'react-apollo';
import {gql, ApolloError} from 'apollo-boost';
import {BookingSubmit} from '.';

interface IProps {
    error?: ApolloError
    loading?: boolean
    onQuery: (variables: BookingSubmit) => Promise<void>
}

export const QueryForm: React.FC<IProps> = ({onQuery, error, loading = false}) => {
    const {setLoading} = useLoading();
    const {current: {user}} = useStore();

    const {register, handleSubmit, errors, clearErrors} = useForm<BookingSubmit>({
        reValidateMode: "onBlur",
        defaultValues: {email: user ? user.email : ""}
    });

    const bookingSubmit = async (data: BookingSubmit) => {
        try {
            clearErrors();
            setLoading(true);
            await onQuery(data);

        } catch (e) {} finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(bookingSubmit)}>
            <Paper>
                <Col fullWidth p={16}>
                    <TextField
                        fullWidth
                        disabled={!!user}
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
                            validate: (v: string) => v.startsWith("TC-") || 'Does not look like code (:'
                        })}
                        name={"code"}
                        label="Code *"
                        error={!!errors.code?.message}
                        helperText={errors.code?.message || " "}
                        variant="filled"
                    />
                    <Button fullWidth variant="contained" type="submit">
                        {loading ? <CircularProgress size={24} /> : "Track order"}
                    </Button>
                </Col>
            </Paper>
            <Box mt={2}>
                {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
            </Box>
        </form>
    )
}