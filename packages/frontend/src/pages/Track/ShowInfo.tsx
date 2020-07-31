import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {StatusType, SafeJSON, Dict} from '@truecost/shared';
import {Table, TableBody, TableRow, TableCell, Typography, Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';

interface IProps {
    raw: any
}

export const ShowBookingInfo: React.FC<IProps> = ({raw}) => {
    const history = useHistory();
    debugger;
    const {code, status, total, info, data} = raw;

    const infoParsed = SafeJSON.parse<Dict<string>>(info, {});
    const dataParsed = SafeJSON.parse<{game: string, data: any[]}>(data, {game: "-", data: []})

    return (
        <Col fullWidth left>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMore />}>
                    {code}
                    {status}
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Info</Typography>
                    <Table>
                        <TableBody>
                            {
                                Object.keys(infoParsed).map(key => (
                                    <TableRow>
                                        <TableCell>{key}</TableCell>
                                        <TableCell>{infoParsed[key]}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <Typography>Data</Typography>
                    <Table>
                        <TableBody>
                            {
                                dataParsed.data
                                    .filter(d => typeof d == "object" &&
                                                "quantity" in d &&
                                                "amount" in d &&
                                                "item" in d)
                                    .map(({item, quantity, amount} )=> (
                                        <TableRow>
                                            <TableCell>{item}</TableCell>
                                            <TableCell>{`${amount / 100} $ x ${quantity}}`}</TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>
        </Col>
    )
}