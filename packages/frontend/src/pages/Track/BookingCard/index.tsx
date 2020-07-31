import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {StatusType, SafeJSON, Dict} from '@truecost/shared';
import {Table, TableBody, TableRow, TableCell, Typography, Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import {BookingInfo} from './BookingInfo';
import {BookingGoods} from './BookingGoods';

interface IProps {
    raw: any
}

export const BookingCard: React.FC<IProps> = ({raw}) => {
    const history = useHistory();
    const {code, status, total, info, data} = raw;

    const infoParsed = SafeJSON.parse<Dict<any>>(info, {});
    const dataParsed = SafeJSON.parse<{game: string, data: any[]}>(data, {game: "-", data: []})

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}>
                <Col left>
                    <Typography>
                        {code}
                    </Typography>
                    <Typography variant="caption">
                        {status}
                    </Typography>
                </Col>
            </AccordionSummary>
            <AccordionDetails>
                <Col fullWidth left s={16}>
                    <BookingInfo info={infoParsed} />
                    <BookingGoods goods={dataParsed} />
                </Col>
            </AccordionDetails>
        </Accordion >
    )
}