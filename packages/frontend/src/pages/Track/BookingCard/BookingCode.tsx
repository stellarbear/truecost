import * as React from 'react';
import {Typography} from '@material-ui/core';

interface IProps {
    code: string;
}

export const BookingCode: React.FC<IProps> = ({code}) => (
    <Typography  variant="h6">{`Code: ${code}`}</Typography>
); 