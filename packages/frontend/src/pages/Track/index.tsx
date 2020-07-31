import * as React from 'react';
import {TextField, Button, Box, Container, Paper} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import {validate} from '@truecost/shared';
import {useQuery, useLazyQuery} from 'react-apollo';
import {gql} from 'apollo-boost';
import {QueryForm} from './QueryForm';
import {ShowBookingInfo} from './ShowInfo';

const GET_BOOKING = gql`
    query BookingGetByCode($email: String!, $code: String!) {
        BookingGetByCode(email:$email, code:$code) {
            code
            status
            total
            info
            data
        }
    }
`

export interface BookingSubmit {
    email: string
    code: string
}

export const Track: React.FC = () => {
    const [query, {data, error, loading}] = useLazyQuery(GET_BOOKING);

    const onQuery = async (variables: BookingSubmit) => {
        const responce = await query({variables});
    }

    return (
        <Container maxWidth="xs">
            {data?.BookingGetByCode
                ? <ShowBookingInfo raw={data.BookingGetByCode}
                />
                : <QueryForm onQuery={onQuery} error={error} />
            }
        </Container>
    )
}