import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {StatusType, SafeJSON, Dict} from '@truecost/shared';
import {Table, TableBody, TableRow, TableCell, Typography, Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core';

interface IProps {
    info: Dict<any>
}

export const BookingInfo: React.FC<IProps> = ({info}) => {
    const renderValue = (key: string) => (
        Array.isArray(info[key])
            ? info[key].join(", ")
            : typeof info[key] === "boolean"
                ? info[key] ? "+" : "-"
                : info[key]
    )

    return (
        <>
            <Typography>Information: </Typography>
            <Table>
                <TableBody>
                    {
                        Object.keys(info).map((key: string) => (
                            <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{renderValue(key)}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    )
}