import * as React from 'react';
import {gql} from 'apollo-boost';
import {validate, subscription} from '@truecost/shared';
import {TextField, Typography, Paper, Button, CircularProgress} from '@material-ui/core';
import {Col, Row} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import {useLazyQuery} from 'react-apollo';
import {ErrorOption} from 'react-hook-form/dist/types/form';
import {useNotification} from 'components/wrappers/NotifyWrapper';

const GET_SUBSCRIPTION = gql`
    query UserGetSubscription($email: String!) {
        UserGetSubscription(email:$email) {
            id
        }
    }
`;

interface IProps {
    register: any
    email: string
    error?: string
    disabled: boolean
    setCurrent: (value?: string) => void
    setError: (name: "email", error: ErrorOption) => void
}

export const EmailFields: React.FC<IProps> = (props) => {
    const {error, disabled, setCurrent, register, email, setError} = props;
    const [query, {data, loading}] = useLazyQuery(GET_SUBSCRIPTION);
    const {notify} = useNotification();

    const {current: {user}} = useStore();

    React.useEffect(() => {
        if (user) {
            const payed = subscription.validate(user as any) &&
                user?.subscription!;

            if (payed) {
                setCurrent(user?.subscription?.id);
            }
        }
    }, [user])

    React.useEffect(() => {
        if (data) {
            if (data?.UserGetSubscription) {
                setCurrent(data?.UserGetSubscription.id)
                notify("Subscription applied")
            } else {
                notify("No active subscription on this email")
            }
        }
    }, [data?.UserGetSubscription])

    const onClick = () => {
        if (email.length === 0) {
            setError("email", {type: "error", message: "This field is required"})
        } else if (!validate("email").test(email)) {
            setError("email", {type: "error", message: "Does not look like email (:"})
        } else {
            query({variables: {email}});
        }
    }

    return (
        <Paper elevation={3}>
            <Col fullWidth p={8}>
                <Typography variant="caption">Provide billing email</Typography>
                <Row width={["100%", "auto"]} s={8}>
                    <TextField
                        fullWidth
                        disabled={disabled}
                        inputRef={register({
                            required: "This field is required",
                            pattern: {
                                value: validate("email").regex,
                                message: "Does not look like email (:",
                            },
                        })}
                        name={"email"}
                        label="Email *"
                        error={!!error}
                        helperText={error}
                        variant="filled"
                    />
                    <Button onClick={() => onClick()}>
                        {
                            loading
                                ? <CircularProgress size={24} />
                                : `Check subscription`
                        }
                    </Button>
                </Row>
            </Col>
        </Paper >
    )
}