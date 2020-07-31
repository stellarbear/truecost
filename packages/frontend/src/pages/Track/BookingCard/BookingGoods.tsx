import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {StatusType, SafeJSON, Dict} from '@truecost/shared';
import {Table, TableBody, TableRow, TableCell, Typography, Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';
import {BookingInfo} from './BookingInfo';

interface IProps {
    goods: {
        game: string;
        data: any[];
    }
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
                            .map(({name, quantity, amount}) => (
                                <TableRow key={name}>
                                    <TableCell>{name}</TableCell>
                                    <TableCell style={{whiteSpace: "nowrap"}}>{`${amount / 100} $ x ${quantity}`}</TableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
        </ >
    )
}