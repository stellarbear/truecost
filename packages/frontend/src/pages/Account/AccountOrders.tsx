import * as React from 'react';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {Box, Button, Container} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {parseApolloError} from 'auxiliary/error';
import {Col} from 'pages/Base/Grid';
import {BookingCard} from 'pages/Track/BookingCard';
import {gql, useQuery} from '@apollo/client';
import {InfoCard} from 'pages/Base/InfoCard';

const GET_BOOKING = gql`
    query UserGetBooking {
        UserGetBooking {
            code
            status
            total
            info
            data
            game
            subscription
            currency

            id
            images
        }
    }
`;

export const AccountOrder: React.FC = () => {
    const {setLoading} = useLoading();
    const {data, loading, error} = useQuery(GET_BOOKING);

    setLoading(loading);

    const orders = (data?.UserGetBooking &&
        Array.isArray(data.UserGetBooking) &&
        data.UserGetBooking) || [];

    if (orders.length == 0) {
        return (
            <InfoCard
                text={[
                    'You have not ordered anything yet',
                    'Do not forget to (:',
                ]}
                actions={[
                    <Button key={0}>To the shop!</Button>,
                ]} />
        );
    }

    return (
        <Container maxWidth="sm">
            <Col s={16}>
                {
                    orders.map((raw: any, index: number) =>
                        <div key={index} >
                            <BookingCard raw={raw}/>
                        </div>,
                    )
                }
            </Col>
            <Box mt={2}>
                {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
            </Box>
        </Container>
    );
};
