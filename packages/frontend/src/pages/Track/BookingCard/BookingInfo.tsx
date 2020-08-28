import * as React from 'react';
import {Dict} from '@truecost/shared';
import {Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';

interface IProps {
    info: Dict<any>;
}

export const BookingInfo: React.FC<IProps> = ({info}) => {
    const renderValue = (key: string) => (
        Array.isArray(info[key])
            ? info[key].join(", ")
            : typeof info[key] === "boolean"
            ? info[key] ? "+" : "-"
            : info[key]
    );

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
    );
};
