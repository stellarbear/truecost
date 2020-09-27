import * as React from 'react';
import {Typography} from '@material-ui/core';
import {backend} from 'auxiliary/route';
import {Carousel} from 'components/Carousel';

interface IProps {
    bookingId: string;
    images: string[];
}

export const BookingImages: React.FC<IProps> = ({bookingId, images}) => {
    const image = (url: string) => `${backend.uri}/${bookingId}/${url}/u.jpg`;

    return (
        images.length > 0 ? (
            <>
                <Typography>Verification: </Typography>
                <Carousel alt={`${bookingId} order`}>
                    {
                        images.map((id) => image(id))
                    }
                </Carousel>
            </>
        ) : null
    );
};
