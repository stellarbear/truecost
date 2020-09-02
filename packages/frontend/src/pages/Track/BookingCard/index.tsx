import * as React from 'react';
import {Col} from 'pages/Base/Grid';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {Dict, SafeJSON} from '@truecost/shared';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography} from '@material-ui/core';
import {BookingInfo} from './BookingInfo';
import {BookingGoods} from './BookingGoods';
import {BookingImages} from './BookingImages';
import {BookingTotal} from './BookingTotal';

interface IProps {
    raw: any;
}

export const BookingCard: React.FC<IProps> = ({raw}) => {
    const {code, status, total, info, data, images, id} = raw;

    const infoParsed = SafeJSON.parse<Dict<any>>(info, {});
    const dataParsed = SafeJSON.parse<{ game: string; data: any[] }>(data, {game: "-", data: []});

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore/>}>
                <Col left>
                    <Typography>
                        {code}
                    </Typography>
                    <Typography variant="caption">
                        {status}
                    </Typography>
                </Col>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <Col fullWidth left s={16}>
                    <BookingImages bookingId={id} images={images || []}/>
                    <BookingInfo info={infoParsed}/>
                    <BookingGoods goods={dataParsed}/>
                    <BookingTotal total={total || 1}/>
                </Col>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};
