import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col} from 'pages/Base/Grid';
import {useForm} from 'react-hook-form';
import {loadStripe} from '@stripe/stripe-js';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {EmailSubscription} from './EmailSubscription';
import {EmailFields} from './EmailFields';
import {EmailPrice} from './EmailPrice';
import {gql, useMutation} from '@apollo/client';
import {EmailMethod, PaymentMethod} from './EmailMethod';
import {calcTotal} from '../helper';
import {CalcPrice} from '@truecost/shared';

interface IProps {
    info: Record<string, any>;
}

interface BookingSubmit {
    email: string;
    coupon?: string;
}

const MAKE_BOOKING = gql`
    mutation BookingMake($input: BookingMakeInput!) {
        BookingMake(input: $input)
    }
`;

const payPalLink = 'https://www.paypal.com/paypalme/truecost/';

export const EmalInfo: React.FC<IProps> = ({info}) => {
    const {setLoading} = useLoading();
    const [method, setMethod] = useState(PaymentMethod.Stripe);

    const store = useStore();
    const {current: {user, game, cart}, payment: {stripe: stripeKey}, currency} = store;
    const [mutation, {data, error, loading}] = useMutation(MAKE_BOOKING);

    const [selectedSubscription, setSelectedSubscription] = useState<string | undefined>();
    const [currentSubscription, setCurrentSubscription] = useState<string | undefined>(user?.subscription?.id);

    const {register, handleSubmit, errors, clearErrors, watch, setError} = useForm<BookingSubmit>({
        reValidateMode: "onBlur",
        defaultValues: {email: user ? user.email : "", coupon: ""},
    });

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
            const {platform, text, cross} = info;

            debugger;

            const variables = {
                ...input,
                method,
                game: game.id,
                currency: currency.id,
                subscription: selectedSubscription,
                booking: JSON.stringify(cartItems),
                info: JSON.stringify({platform, text, cross}),
            };

            await mutation({variables: {input: variables}});

            switch (method) {
                case PaymentMethod.PayPal:
                    let {price} = total;
                    if (input.coupon === "SUBS") {
                        price = CalcPrice.percentage(price, 90);
                    }

                    const link = payPalLink + price + currency.id;
                    window.location = link as any;

                    return;
                case PaymentMethod.Stripe:
                default:
                    return;

            }
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
        <form onSubmit={handleSubmit(bookingSubmit)}>
            <Col s={16}>
                <EmailSubscription
                    current={currentSubscription}
                    selected={selectedSubscription}
                    setSelected={setSelectedSubscription}
                />
                <EmailFields
                    register={register}
                    email={watch("email")}
                    setError={setError}
                    clearErrors={clearErrors}
                    setCurrent={setCurrentSubscription}
                    error={errors.email?.message}
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
