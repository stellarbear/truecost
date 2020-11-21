import * as React from 'react';
import {Col} from 'pages/Base/Grid';
import {Button} from '@material-ui/core';
import {BookingCard} from './BookingCard';
import ArrowBack from '@material-ui/icons/ArrowBack';

interface IProps {
    raw: any;
    reset: () => void;
}

export const ShowBookingInfo: React.FC<IProps> = ({raw, reset}) => (
    <Col s={16} justify="flex-start">
        <Button
            onClick={reset}
            startIcon={< ArrowBack />}
        >
            Back to tracking
        </Button>
        <div>
            <BookingCard raw={raw} />
        </div>
    </Col>
);
