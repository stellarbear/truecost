import * as React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import {Select, MenuItem} from '@material-ui/core';
import {sequence} from 'auxiliary/sequence';
import {Row, Col} from 'pages/Base/Grid';
import {InfoCard} from 'pages/Base/InfoCard';

interface IProps {
    data: any[],
    chunk?: number
    limit?: number
    children: (data: any[]) => React.ReactNode
}

export const ArraySlice: React.FC<IProps> = (props) => {
    const {children, data, chunk = 8, limit = 8} = props;
    const [page, setPage] = React.useState(1);
    const [count, setCount] = React.useState(chunk);

    const select = () => (
        <Select
            value={count}
            disableUnderline
            renderValue={val => `${val} items`}
            MenuProps={{disableScrollLock: true}}
            onChange={(event) => setCount(event.target.value as number || 6)}
        >
            {sequence(limit, (i) => (i + 1) * chunk).map((num) =>
                <MenuItem key={num}
                    value={num}>{num}</MenuItem>)}
        </Select>
    )

    const pagination = () => (
        <Pagination
            showLastButton
            showFirstButton
            count={Math.ceil(data.length / count)} page={page}
            onChange={(_, value) => setPage(value)} />
    )

    return (
        <Col fullWidth s={16}>
            <Row start s={16}>
                {pagination()}
                {select()}
            </Row>
            {children(data.slice((page - 1) * count, page * count))}
            <Row start>
                {pagination()}
            </Row>
        </Col>
    )
}