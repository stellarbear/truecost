import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Accordion, AccordionSummary, AccordionDetails, IconButton, Typography, Divider, TextField, Button, Box, Paper} from '@material-ui/core';
import {Price, validate} from '@truecost/shared';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {useForm} from 'react-hook-form';
import {loadStripe} from '@stripe/stripe-js';
import {useMutation} from 'react-apollo';
import {gql} from 'apollo-boost';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {useState} from 'react';
import {EmailSubscription} from './EmailSubscription';
import {EmailFields} from './EmailFields';

interface IProps {
    meta: Record<string, any>
}

interface BookingSubmit {
    email: string;
}

const MAKE_BOOKING = gql`
    mutation BookingMake($email: String!, $booking: String!, $meta: String!, $game: String!, $subscription: String) {
        BookingMake(email:$email, booking:$booking, meta: $meta, game: $game, subscription:$subscription) 
    }
`;

export const EmalInfo: React.FC<IProps> = ({meta}) => {
    const {setLoading} = useLoading();
    const {current: {user, game, cart}, payment: {stripe: stripeKey}} = useStore();
    const [mutation, {data, error, loading}] = useMutation(MAKE_BOOKING);

    const [subscription, setSubscription] = useState<string | undefined>();
    const [currentSubscription, setCurrentSubscription] = useState<string | undefined>();

    const {register, handleSubmit, errors, clearErrors, watch} = useForm<BookingSubmit>({
        reValidateMode: "onBlur",
        defaultValues: {email: user ? user.email : ""}
    });

    const cartItems = cart();

    const bookingSubmit = async (data: BookingSubmit) => {
        try {
            clearErrors();
            setLoading(true);

            const {platform, info, cross, time, zone} = meta;

            const variables = {
                ...data,
                subscription,
                game: game.id,
                booking: JSON.stringify(cartItems),
                meta: JSON.stringify({platform, info, cross, time, zone}),
            }
            await mutation({variables});
        } catch (e) {} finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (data?.BookingMake) {
            redirectToStripe(data.BookingMake);
        }
    }, [data?.BookingMake])

    const redirectToStripe = async (sessionId: string) => {
        const stripe = await loadStripe(stripeKey);
        if (stripe) {
            const {error} = await stripe.redirectToCheckout({sessionId});
            debugger;
        }
    }

    return (
        <Col s={16} fullWidth right>
            <form onSubmit={handleSubmit(bookingSubmit)}>
                <Col fullWidth s={8}>
                    <EmailFields
                        disabled={!!user}
                        register={register}
                        email={watch("email")}
                        setCurrent={setCurrentSubscription}
                        error={errors.email?.message}
                    />
                    <EmailSubscription
                        current={currentSubscription}
                        selected={subscription}
                        setSelected={setSubscription}
                    />
                    <Row end>
                        <Button variant="contained" type="submit">Pay</Button>
                    </Row>
                    <Box mt={2}>
                        {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
                    </Box>
                </Col>
            </form>
        </Col>
    )
}