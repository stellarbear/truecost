import * as React from 'react';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {Box, Container} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {parseApolloError} from 'auxiliary/error';
import {Col} from 'pages/Base/Grid';
import {BookingCard} from 'pages/Track/BookingCard';
import {gql, useQuery} from '@apollo/client';

const GET_BOOKING = gql`
    query UserGetBooking {
        UserGetBooking {
            code
            status
            total
            info
            data

            id
            images
        }
    }
`;

export const AccountOrder: React.FC = () => {
    const {setLoading} = useLoading();
    const {data, loading, error} = useQuery(GET_BOOKING);

    setLoading(loading);

    return (
        <Container maxWidth="sm">
            <Col fullWidth s={16}>
                {
                    data?.UserGetBooking &&
                    Array.isArray(data.UserGetBooking) &&
                    data.UserGetBooking.map((raw: any, index: number) =>
                        <BookingCard raw={raw} key={index}/>,
                    )
                }
            </Col>
            <Box mt={2}>
                {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
            </Box>
        </Container>
    );
};
