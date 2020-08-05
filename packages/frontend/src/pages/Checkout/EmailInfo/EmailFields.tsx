import * as React from 'react';
import {gql} from 'apollo-boost';
import {validate, subscriptionVaildate} from '@truecost/shared';
import {TextField, Typography, Paper, Button, CircularProgress} from '@material-ui/core';
import {Col, Row} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import {useLazyQuery} from 'react-apollo';

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
}

export const EmailFields: React.FC<IProps> = (props) => {
    const {error, disabled, setCurrent, register, email} = props;
    const [query, {data, loading}] = useLazyQuery(GET_SUBSCRIPTION);

    const {store: {shop: {subs}}, current: {user}} = useStore();

    React.useEffect(() => {
        const payed = subscriptionVaildate(user as any, subs[user?.subscription || "0"]) &&
            user?.subscription!;

        if (payed) {
            setCurrent(payed);
        }
    }, [user])

    React.useEffect(() => {
        if (data?.UserGetSubscription) {
            debugger;
            setCurrent(data?.UserGetSubscription.id)
        }
    }, [data?.UserGetSubscription])

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
                    <Button onClick={() => query({variables: {email}})}>
                        {
                            loading
                                ? <CircularProgress size={24} />
                                : `Check subscription`
                        }
                    </Button>
                </Row>
            </Col>
        </Paper>
    )
}