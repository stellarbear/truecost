import {gql, useQuery} from '@apollo/client';
import {CircularProgress} from '@material-ui/core';
import * as React from 'react';
import {Redirect, useParams} from 'react-router';
import {IBookingData} from './interfaces';
import {BookingUpsertForm} from './BookingUpsertForm';

const GET_BOOKING_BY_ID = gql`
    query BookingGetById ($id: String!) {
        BookingGetById(id:$id) {
            id
            total
            data
            pi
            info
            user {
                email
            }
            currency
        }
  }
`;

interface Mutation {
    BookingGetById?: IBookingData;
}

export const BookingUpsert: React.FC = () => {
    const {id} = useParams<{id?: string}>();
    const {data, loading, error} = useQuery<Mutation>(GET_BOOKING_BY_ID, {variables: {id}});

    if (loading) {
        return <CircularProgress />;
    }

    if (id && error) {
        return <Redirect to="/" />;
    }

    return (
        <BookingUpsertForm
            booking={data?.BookingGetById}
        />
    );
};
