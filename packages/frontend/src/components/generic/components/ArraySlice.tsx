import * as React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import {Select, MenuItem} from '@material-ui/core';
import {sequence} from 'auxiliary/sequence';
import {Row, Col} from 'pages/Base/Grid';
import {InfoCard} from 'pages/Base/InfoCard';
import {useStorage} from 'auxiliary/useStorage';

interface IProps {
    prefix: string
    data: any[],
    chunk?: number
    limit?: number
    children: (data: any[]) => React.ReactNode
}

export const ArraySlice: React.FC<IProps> = (props) => {
    const {children, data, chunk = 12, limit = 8, prefix} = props;
    const [count, setCount] = useStorage(`${prefix}-chunk`, chunk);
    const [page, setPage] = useStorage(`${prefix}-page`, 1, (p) => Math.ceil(data.length / count) <= p ? 1 : p);

    React.useEffect(() => {
        if (Math.ceil(data.length / count) <= page) {
            setPage(1)
        }
    }, [data])

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
            <Row start s={16} wrap>
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
