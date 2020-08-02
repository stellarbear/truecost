import * as React from 'react';
import {Typography} from '@material-ui/core';

interface IProps {
    total: number
}

export const BookingTotal: React.FC<IProps> = ({total}) => (
    <Typography>{`Total: ${total / 100} $`}</Typography>
) 