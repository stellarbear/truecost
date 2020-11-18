import * as React from 'react';
import {subscription, validate} from '@truecost/shared';
import {Button, CircularProgress, TextField} from '@material-ui/core';
import {Row} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import {ErrorOption} from 'react-hook-form';
import {useNotification} from 'components/wrappers/NotifyWrapper';
import {gql, useLazyQuery} from '@apollo/client';
import {useDebounceState} from 'auxiliary/useDebounceState';

const GET_SUBSCRIPTION = gql`
    query UserGetSubscription($email: String!) {
        UserGetSubscription(email:$email) {
            id
        }
    }
`;

interface IProps {
    register: any;
    email: string;
    error?: string;
    disabled: boolean;
    clearErrors: () => void;
    setCurrent: (value?: string) => void;
    setError: (name: "email", error: ErrorOption) => void;
}

export const EmailFields: React.FC<IProps> = (props) => {
    const {error, disabled, setCurrent, register, email, setError, clearErrors} = props;
    const [query, {data, loading}] = useLazyQuery(GET_SUBSCRIPTION);
    const {notify} = useNotification();

    const [mounted, setMounted] = React.useState(false)

    const onEmailUpdate = (email: string) => {
        console.log(email);
        if (email.length === 0) {
            setError("email", {type: "error", message: "This field is required"});
        } else if (!validate("email").test(email)) {
            setError("email", {type: "error", message: "Does not look like email (:"});
        } else {
            query({variables: {email}});
        }
    };

    const {bubbleState} = useDebounceState(email, onEmailUpdate, 1200);

    React.useEffect(() => {
        if (mounted) {
            bubbleState(email)
        } else {
            setMounted(true)
        }
    }, [email])

    const {current: {user}} = useStore();

    React.useEffect(() => {
        if (user) {
            const payed = subscription.validate(user as any) &&
                user?.subscription;

            if (payed) {
                setCurrent(user?.subscription?.id);
            }
        }
    }, [user]);

    React.useEffect(() => {
        if (data) {
            if (data?.UserGetSubscription) {
                setCurrent(data?.UserGetSubscription.id);
                notify("Subscription applied");
            } else {
                setCurrent();
            }
        }
    }, [data?.UserGetSubscription]);

    return (
        <Row s={8}>
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
                label="Your email address *"
                error={!!error}
                helperText={error}
                variant="outlined"
                onChange={() => {
                    clearErrors();
                    setCurrent();
                }}
                InputProps={{
                    endAdornment: loading && <CircularProgress size={24} />
                }}
            />
        </Row>
    );
};
