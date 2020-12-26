import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {useHistory, useLocation} from "react-router-dom";
import {useStore} from 'pages/Data/Wrapper';
import {gql, useLazyQuery} from '@apollo/client';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {getQueryStringParams} from './helper';
import {ErrorBox} from 'components';
import {Col} from 'pages/Base/Grid';

const STRIPE_ACCEPT = gql`
    query BookingStripeAccept($token: String!) {
        BookingStripeAccept(token: $token)
    }
`;

export const CheckoutStripe: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const {setLoading} = useLoading();
    const {current: {game}} = useStore();
    const {token} = getQueryStringParams(location.search);

    const [query, {data, loading, error}] = useLazyQuery(STRIPE_ACCEPT);

    React.useEffect(() => {
        setLoading(true);
        query({variables: {token}});
    }, []);

    React.useEffect(() => {
        if (data) {
            setLoading(false);

            if (data?.BookingStripeAccept) {
                history.push(`/${game.url}/checkout/success`);
            }
        }
        if (error) {
            setLoading(false);
        }
    }, [data, loading, error]);

    return (
        <Col s={16}>
            <InfoCard
                text={[
                    "The purchase is in progress",
                    "Do NOT close this tab!",
                    " ",
                    "Note: you will be redirected automatically",
                ]} />
            <ErrorBox error={error} />
        </Col>
    );
};
