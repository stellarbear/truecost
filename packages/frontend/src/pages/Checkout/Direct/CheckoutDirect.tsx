import { gql, useMutation, useQuery } from '@apollo/client';
import { CircularProgress, Container, NoSsr } from '@material-ui/core';
import { ErrorBox } from 'components';
import { useLoading } from 'components/wrappers/LoadingWrapper';
import { Col } from 'pages/Base/Grid';
import * as React from 'react';
import { useParams } from 'react-router';
import { EmailMethod, PaymentMethod } from '../EmailInfo/EmailMethod';
import { OrderDetails } from './OrderDetails';
import { OrderPrice } from './OrderPrice';
import {loadStripe} from '@stripe/stripe-js';
import { useStore } from 'pages/Data/Wrapper';
import { Currencies, CurrencyKey } from '@truecost/shared';

const GET_BY_ID = gql`
    query BookingGetById($id: String!) {
        BookingGetById(id: $id) {
            currency
            total
            game
            data
        }
    }
`;

const MAKE_BOOKING = gql`
    mutation BookingMakeById($id: String!, $method: String!) {
        BookingMakeById(id: $id, method: $method)
    }
`;


export const CheckoutDirect: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { setLoading } = useLoading();

    const store = useStore();
    const {payment: {stripe: stripeKey}} = store;

    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_BY_ID, { variables: { id } });
    const [method, setMethod] = React.useState(PaymentMethod.PayPal);
    const [mutation, { error: mutationError, loading: mutationLoading }] = useMutation(MAKE_BOOKING);

    if (queryLoading) {
        return <CircularProgress />;
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            setLoading(true);

            const variables = { id, method };
            const result = await mutation({ variables });
            
            if (result.data?.BookingMakeById) {
                switch (method) {
                    case PaymentMethod.PayPal:
                        const price = +queryData?.BookingGetById?.total;
                        const currency = queryData?.BookingGetById?.currency as any;
                        const currencyRecord = Currencies[currency as CurrencyKey];

                        const link = result.data?.BookingMakeById + price + currencyRecord.id;
                        window.location = link as any;
                        return;
                    case PaymentMethod.Stripe:
                        const stripe = await loadStripe(stripeKey);
                        if (stripe) {
                            await stripe.redirectToCheckout({ sessionId: result.data?.BookingMakeById });
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
        <NoSsr>
            <form onSubmit={onSubmit}>
                <Container maxWidth="sm" style={{ padding: 0 }}>
                    <ErrorBox error={queryError} />
                    {queryData?.BookingGetById && !queryError && (
                        <Col s={16}>
                            <OrderDetails
                                data={queryData?.BookingGetById}
                            />
                            <EmailMethod
                                method={method}
                                setMethod={setMethod}
                            />
                            <OrderPrice
                                error={mutationError}
                                loading={mutationLoading}
                                currency={queryData?.BookingGetById?.currency}
                                total={+queryData?.BookingGetById?.total}
                            />
                        </Col>
                    )}
                </Container>
            </form>
        </NoSsr>
    );
};