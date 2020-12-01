import * as React from 'react';
import {Typography} from '@material-ui/core';
import {ICurrency} from '@truecost/shared';

interface IProps {
    currency: ICurrency;
    total: number;
}

export const BookingTotal: React.FC<IProps> = ({total, currency}) => (
    <Typography  variant="h6">{`Total: ${total / 100} ${currency.label}`}</Typography>
); 