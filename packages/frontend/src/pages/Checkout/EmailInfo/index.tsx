import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Box, Typography} from '@material-ui/core';
import {useForm} from 'react-hook-form';
import {loadStripe} from '@stripe/stripe-js';
import Alert from '@material-ui/lab/Alert';
import {parseApolloError} from 'auxiliary/error';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {EmailSubscription} from './EmailSubscription';
import {EmailFields} from './EmailFields';
import {EmailPrice} from './EmailPrice';
import {gql, useMutation} from '@apollo/client';

interface IProps {
    info: Record<string, any>;
}

interface BookingSubmit {
    email: string;
}

const MAKE_BOOKING = gql`
    mutation BookingMake($email: String!, $booking: String!, $info: String!, $game: String!, $subscription: String) {
        BookingMake(email:$email, booking:$booking, info: $info, game: $game, subscription:$subscription)
    }
`;

export const EmalInfo: React.FC<IProps> = ({info}) => {
    const {setLoading} = useLoading();
    const {current: {user, game, cart}, payment: {stripe: stripeKey}} = useStore();
    const [mutation, {data, error, loading}] = useMutation(MAKE_BOOKING);

    const [selectedSubscription, setSelectedSubscription] = useState<string | undefined>();
    const [currentSubscription, setCurrentSubscription] = useState<string | undefined>(user?.subscription?.id);

    const {register, handleSubmit, errors, clearErrors, watch, setError} = useForm<BookingSubmit>({
        reValidateMode: "onBlur",
        defaultValues: {email: user ? user.email : ""},
    });

    const cartItems = cart();

    const bookingSubmit = async () => {
        try {
            clearErrors();
            setLoading(true);

            const {platform, text, cross, time, zone} = info;

            const variables = {
                email: watch("email"),  //  hack cause var is undefined
                game: game.id,
                subscription: selectedSubscription,
                booking: JSON.stringify(cartItems),
                info: JSON.stringify({platform, text, cross, time, zone}),
            };
            await mutation({variables});
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (data?.BookingMake) {
            redirectToStripe(data.BookingMake);
        }
    }, [data?.BookingMake]);

    const redirectToStripe = async (sessionId: string) => {
        const stripe = await loadStripe(stripeKey);
        if (stripe) {
            await stripe.redirectToCheckout({sessionId});
        }
    };

    return (
        <Col s={16}>
            <Row>
                <Typography variant="caption">Subscription (optional)</Typography>
            </Row>
            <form onSubmit={handleSubmit(bookingSubmit)}>
                <Col s={16}>
                    <EmailSubscription
                        current={currentSubscription}
                        selected={selectedSubscription}
                        setSelected={setSelectedSubscription}
                    />
                    <EmailFields
                        disabled={!!user}
                        register={register}
                        email={watch("email")}
                        setError={setError}
                        clearErrors={clearErrors}
                        setCurrent={setCurrentSubscription}
                        error={errors.email?.message}
                    />
                    <EmailPrice
                        loading={loading}
                        current={currentSubscription}
                        selected={selectedSubscription}
                    />
                    <Box mt={2}>
                        {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
                    </Box>
                </Col>
            </form>
        </Col>
    );
};
