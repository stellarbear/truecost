import * as React from 'react';
import {Box, Container} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {parseApolloError} from 'auxiliary/error';
import {QueryForm} from './QueryForm';
import {ShowBookingInfo} from './ShowInfo';
import {Meta} from 'pages/Base/Meta';
import {gql, useLazyQuery} from '@apollo/client';

const GET_BOOKING = gql`
    query BookingGetByCode($email: String!, $code: String!) {
        BookingGetByCode(email:$email, code:$code) {
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

export interface BookingSubmit {
    email: string;
    code: string;
}

export const Track: React.FC = () => {
    const [query, {data, error, loading}] = useLazyQuery(GET_BOOKING);

    const onQuery = async (variables: BookingSubmit) => await query({variables});

    const reset = () => {
        if (data) {
            data.BookingGetByCode = null;
        }
    };

    return (
        <>
            <Meta />
            <Container maxWidth="sm">
                {data?.BookingGetByCode
                    ? (
                        <ShowBookingInfo
                            reset={reset}
                            raw={data.BookingGetByCode}
                        />
                    ) : (
                        <QueryForm
                            loading={loading}
                            onQuery={onQuery} />
                    )
                }
                <Box mt={2}>
                    {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
                </Box>
            </Container>
        </>
    );
};
