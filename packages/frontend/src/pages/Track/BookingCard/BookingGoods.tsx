import * as React from 'react';
import {Col} from 'pages/Base/Grid';
import {Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';

interface IProps {
    goods: {
        game: string;
        data: any[];
    };
}

export const BookingGoods: React.FC<IProps> = ({goods}) => {
    return (
        <>
            <Typography>Goods: </Typography>
            <Table>
                <TableBody>
                    {
                        goods.data
                            .filter(d => typeof d == "object" &&
                                "quantity" in d &&
                                "amount" in d &&
                                "name" in d)
                            .map(({name, quantity, description, amount}) => (
                                <TableRow key={name}>
                                    <TableCell>
                                        <Col left>
                                            <Typography>{name}</Typography>
                                            <Typography variant="caption">{description || "-"}</Typography>
                                        </Col>
                                    </TableCell>
                                    <TableCell
                                        style={{whiteSpace: "nowrap"}}>{`${amount / 100} $ x ${quantity}`}</TableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
        </ >
    );
};
