import * as React from 'react';
import {Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';
import {ICurrency} from '@truecost/shared';

interface IProps {
    currency: ICurrency;
    data: any[];
}

export const BookingGoods: React.FC<IProps> = (props) => {
    const {data, currency} = props;
    return (
        <>
            <Typography variant="h6">Goods: </Typography>
            <Table>
                <TableBody>
                    {
                        data
                            .filter(d => typeof d == "object" &&
                                "quantity" in d &&
                                "amount" in d &&
                                "name" in d)
                            .map(({name, quantity, description, amount}) => (
                                <TableRow key={name}>
                                    <TableCell>
                                        <Typography>{name}</Typography>
                                        <Typography variant="caption">{description || "-"}</Typography>
                                    </TableCell>
                                    <TableCell
                                        style={{whiteSpace: "nowrap"}}>
                                        {`${amount} ${currency.label} x ${quantity}`}
                                    </TableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
        </ >
    );
};
