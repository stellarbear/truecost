import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col} from 'pages/Base/Grid';
import {useForm} from 'react-hook-form';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {EmailFields} from './EmailFields';
import {EmailPrice} from './EmailPrice';
import {gql, useMutation} from '@apollo/client';
import {EmailMethod, PaymentMethod} from './EmailMethod';
import {calcTotal} from '../helper';
import {loadStripe} from '@stripe/stripe-js';

interface IProps {
    info: Record<string, any>;
}

export interface BookingSubmit {
    email: string;
    coupon?: string;
}

const MAKE_BOOKING = gql`
    mutation BookingMake($input: BookingMakeInput!) {
        BookingMake(input: $input)
    }
`;

export const EmalInfo: React.FC<IProps> = ({info}) => {
    const {setLoading} = useLoading();
    const [method, setMethod] = useState(PaymentMethod.Stripe);

    const store = useStore();
    const {current: {user, game, cart}, payment: {stripe: stripeKey}, currency} = store;
    const [mutation, {error, loading}] = useMutation(MAKE_BOOKING);

    const [selectedSubscription, setSelectedSubscription] = useState<string | undefined>();
    const [currentSubscription, setCurrentSubscription] = useState<string | undefined>(user?.subscription?.id);

    const form = useForm<BookingSubmit>({
        reValidateMode: "onBlur",
        defaultValues: {email: user ? user.email : "", coupon: ""},
    });

    const {handleSubmit, clearErrors} = form;

    const total = calcTotal({
        store,
        current: currentSubscription,
        selected: selectedSubscription,
    });
    const cartItems = cart();

    const bookingSubmit = async (input: BookingSubmit) => {
        try {
            clearErrors();
            setLoading(true);
            const {platform, text, cross, id, messenger} = info;

            const variables = {
                ...input,
                method,
                game: game.id,
                currency: currency.id,
                subscription: selectedSubscription,
                booking: JSON.stringify(cartItems),
                info: JSON.stringify({platform, text, cross, id, messenger}),
            };

            const result = await mutation({variables: {input: variables}});
            if (result.data?.BookingMake) {
                switch (method) {
                    case PaymentMethod.PayPal:
                        window.location = result.data?.BookingMake as any;
                        return;
                    case PaymentMethod.Stripe:
                        const stripe = await loadStripe(stripeKey);
                        if (stripe) {
                            await stripe.redirectToCheckout({sessionId: result.data?.BookingMake});
                        }
                        return;
                    default:
                        return;
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(bookingSubmit)}>
            <Col s={16}>
                <EmailFields
                    form={form}
                    setCurrent={setCurrentSubscription}
                />
                <EmailMethod
                    method={method}
                    setMethod={setMethod}
                />
                <EmailPrice
                    total={total}
                    error={error}
                    loading={loading}
                />
            </Col>
        </form>
    );
};
