import * as React from 'react';
import {Dict} from '@truecost/shared';
import {Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core';

interface IProps {
    info: Dict<any>;
    game: string;
    subscription?: string;
}

export const BookingInfo: React.FC<IProps> = ({info, game}) => {
    const renderValue = (key: string) => (
        Array.isArray(info[key])
            ? info[key].join(", ")
            : typeof info[key] === "boolean"
                ? info[key] ? "+" : "-"
                : info[key]
    );

    return (
        <>
            <Typography variant="h6">Information: </Typography>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Typography>game</Typography>
                        </TableCell>
                        <TableCell
                            style={{whiteSpace: "nowrap"}}>
                            {`${game}`}
                        </TableCell>
                    </TableRow>
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
