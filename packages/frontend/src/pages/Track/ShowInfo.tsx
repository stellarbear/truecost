import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {StatusType, SafeJSON, Dict} from '@truecost/shared';
import {Table, TableBody, TableRow, TableCell, Typography, Accordion, AccordionSummary, AccordionDetails, Button} from '@material-ui/core';
import {BookingCard} from './BookingCard';
import {Link} from 'react-router-dom';
import ArrowBack from '@material-ui/icons/ArrowBack';

interface IProps {
    raw: any
}

export const ShowBookingInfo: React.FC<IProps> = ({raw}) => {
    const history = useHistory();

    return (
        <Col fullWidth left>
            <Button
                component={Link}
                to={`/track`}
                startIcon={< ArrowBack />}
            >
                Back to tracking
        </Button>
            <BookingCard raw={raw} />
        </Col>
    )
}