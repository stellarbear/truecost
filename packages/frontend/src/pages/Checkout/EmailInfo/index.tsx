import {gql, useMutation} from '@apollo/client';
import {Button, Container, Dialog, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {Col} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import * as React from 'react';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {calcTotal} from '../helper';
import {EmailFields} from './EmailFields';
import {EmailMethod, PaymentMethod} from './EmailMethod';
import {EmailPrice} from './EmailPrice';
import SocialDialog from "pages/Base/SocialDialog";
import {social} from "auxiliary/social";

declare let Tawk_API: any;

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

    const [notifyOpened, setNotifyOpened] = React.useState(false);

    const store = useStore();
    const {current: {user, game, cart}, payment: {stripe: stripeKey}, currency} = store;
    const [mutation, {error, loading}] = useMutation(MAKE_BOOKING);

    const [selectedSubscription] = useState<string | undefined>();
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

            // const {platform, text, cross, id, messenger} = info;

            const variables = {
                ...input,
                method,
                game: game.id,
                currency: currency.id,
                subscription: selectedSubscription,
                booking: JSON.stringify(cartItems),
                info: JSON.stringify({}),
            };

            const result = await mutation({variables: {input: variables}});

            setNotifyOpened(true);
            // debugger;
            if (result.data?.BookingMake) {
                // switch (method) {
                //     case PaymentMethod.PayPal:
                //         window.location = result.data?.BookingMake as any;
                //         return;
                //     case PaymentMethod.Stripe:
                //         const stripe = await loadStripe(stripeKey);
                //         if (stripe) {
                //             await stripe.redirectToCheckout({sessionId: result.data?.BookingMake});
                //         }
                //         return;
                //     default:
                //         return;
                // }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog
                open={notifyOpened}
                onClose={() => setNotifyOpened(false)}
            >
                <Container maxWidth="xs" style={{padding: 0}}>
                    <DialogTitle style={{
                        padding: 8,
                    }}>
                        To place an order, please contact us in any way convenient for you.
                    </DialogTitle>
                    <DialogContent>
                    <Col key="0" s={8}>
                            <div style={{
                                display: "flex", flexWrap: "wrap", justifyContent: "space-evenly",
                            }}>
                                {
                                    social.map((item, index) => (
                                        <div key={`social-${index}`} style={{
                                            display: "flex", flexDirection: "column", alignItems: "center",
                                        }}>
                                            <SocialDialog key={`social-${index}`} button={
                                                (
                                                    <Button variant="contained" size="medium">
                                                        {React.cloneElement(item.icon, {
                                                            style: { padding: "8px 0",
                                                                transition: "all 0.2s linear",
                                                            },
                                                        })}
                                                    </Button>
                                                )
                                            } {...item} />

                                            <Typography style={{
                                                transition: "all 0.2s linear",
                                            }}>{item.title}</Typography>
                                        </div>
                                    ))
                                }
                            </div>
                            <Button
                                variant="contained" color="primary"
                                onClick={() => Tawk_API?.maximize()}>
                                send us a message via live chat
                            </Button>
                        </Col>
                    </DialogContent>
                </Container>
            </Dialog>
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
        </>
    );
};
