import * as React from 'react';
import {Col} from 'pages/Base/Grid';
import {Button} from '@material-ui/core';
import {BookingCard} from './BookingCard';
import {Link} from 'react-router-dom';
import ArrowBack from '@material-ui/icons/ArrowBack';

interface IProps {
    raw: any;
}

export const ShowBookingInfo: React.FC<IProps> = ({raw}) => (
    <Col fullWidth left>
        <Button
            component={Link}
            to={`/track`}
            startIcon={< ArrowBack/>}
        >
            Back to tracking
        </Button>
        <BookingCard raw={raw}/>
    </Col>
);
