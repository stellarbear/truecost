import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {useHistory, useLocation} from "react-router-dom";
import {useStore} from 'pages/Data/Wrapper';
import {gql, useLazyQuery} from '@apollo/client';
import {useLoading} from 'components/wrappers/LoadingWrapper';

const PAYPAL_ACCEPT = gql`
    query BookingPaypalAccept($token: String!) {
        BookingPaypalAccept(token: $token)
    }
`;

const getQueryStringParams = (query: string) => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                const [key, value] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, {} as Record<string, any>,
            )
        : {};
};

export const CheckoutPaypal: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const {setLoading} = useLoading();
    const {current: {game}} = useStore();
    const {token} = getQueryStringParams(location.search);

    const [query, {data, loading, error}] = useLazyQuery(PAYPAL_ACCEPT);

    console.log(data, loading);
    React.useEffect(() => {
        setLoading(true);
        query({variables: {token}});
    }, []);

    React.useEffect(() => {
        if (data) {
            setLoading(false);
            debugger;
            if (data?.BookingPaypalAccept) {
                history.push(`/${game.url}/checkout/success`);
            }
        }
        if (error) {
            setLoading(false);
        }
    }, [data, loading, error]);

    return (
        <>
            <InfoCard
                text={[
                    "The purchase is in progress",
                    "Do NOT close this tab!",
                    " ",
                    "Note: you will be redirected automatically",
                ]} />
        </>
    );
};
