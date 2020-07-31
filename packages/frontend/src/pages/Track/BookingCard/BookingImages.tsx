import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {StatusType, SafeJSON, Dict} from '@truecost/shared';
import {Table, TableBody, TableRow, TableCell, Typography, Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import {backend} from 'auxiliary/route';
import {Carousel} from 'components/Carousel';

interface IProps {
    bookingId: string
    images: string[]
}

export const BookingImages: React.FC<IProps> = ({bookingId, images}) => {
    const image = (url: string) => `${backend.uri}/${bookingId}/${url}/u.png`;

    return (
        images.length > 0 ? (
            <>
                <Typography>Verification: </Typography>
                <Carousel>
                    {
                        images.map((id) => image(id))
                    }
                </Carousel>
            </>
        ) : null
    );
}