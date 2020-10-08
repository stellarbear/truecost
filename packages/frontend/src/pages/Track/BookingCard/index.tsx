import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {Dict, SafeJSON} from '@truecost/shared';
import {Accordion, AccordionDetails, AccordionSummary, Divider, Typography} from '@material-ui/core';
import {BookingInfo} from './BookingInfo';
import {BookingGoods} from './BookingGoods';
import {BookingImages} from './BookingImages';
import {BookingTotal} from './BookingTotal';
import {BookingCode} from './BookingCode';

interface IProps {
    raw: any;
}

export const BookingCard: React.FC<IProps> = ({raw}) => {
    const {code, status, total, info, data, images, id} = raw;

    const infoParsed = SafeJSON.parse<Dict<any>>(info, {});
    const dataParsed = SafeJSON.parse<{game: string; data: any[]}>(data, {game: "-", data: []});

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}>
                <Col>
                    <Typography variant="h6">
                        {code}
                    </Typography>
                    <Typography variant="caption">
                        {status}
                    </Typography>
                </Col>
            </AccordionSummary>
            <AccordionDetails>
                <Col fullWidth s={16}>
                    <Divider />
                    <BookingCode code={code}/>
                    <Divider />
                    <BookingImages bookingId={id} images={images || []} />
                    <BookingInfo info={infoParsed} />
                    <BookingGoods goods={dataParsed} />
                    <Row justify="center">
                        <BookingTotal total={total || 1} />
                    </Row>
                </Col>
            </AccordionDetails>
        </Accordion>
    );
};
