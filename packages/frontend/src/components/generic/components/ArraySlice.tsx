import * as React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import {MenuItem, Select} from '@material-ui/core';
import {sequence} from 'auxiliary/sequence';
import {Col, Row} from 'pages/Base/Grid';
import {useStorage} from 'auxiliary/useStorage';

interface IProps {
    scroll?: number;
    prefix: string;
    data: any[];
    chunk?: number;
    limit?: number;
    noSelect?: boolean;
    children: (data: any[]) => React.ReactNode;
}

export const ArraySlice: React.FC<IProps> = (props) => {
    const {children, data, chunk = 12,
        limit = 8, prefix, scroll = 0,
        noSelect = false,
    } = props;
    const [count, setCount] = useStorage(`${prefix}-chunk`, chunk);
    const [page, setPage] = useStorage(`${prefix}-page`, 1, (p) => Math.ceil(data.length / count) < p ? 1 : p);

    React.useEffect(() => {
        if (Math.ceil(data.length / count) < page) {
            setPage(1);
        }
    }, [data]);

    const select = () => (
        <Select
            value={count}
            disableUnderline
            renderValue={val => `${val} items`}
            MenuProps={{disableScrollLock: true}}
            onChange={(event) => {
                setCount(event.target.value as number || chunk);
                setPage(1);
            }}
        >
            {sequence(limit, (i) => (i + 1) * chunk).map((num) =>
                <MenuItem key={num}
                    value={num}>{num}</MenuItem>)}
        </Select>
    );

    const pagination = () => (
        <Pagination
            showLastButton
            showFirstButton
            count={Math.ceil(data.length / count)} page={page}
            onChange={(_, value) => {
                setPage(value);
                scroll && window.scrollY > scroll && window.scroll({top: 0, left: 0, behavior: "smooth"});
            }} />
    );

    return (
        <Col s={16} p={[16, 0]}>
            <Row s={16} wrap>
                {pagination()}
                {noSelect || select()}
            </Row>
            {children(data.slice((page - 1) * count, page * count))}
            <Row>
                {pagination()}
            </Row>
        </Col>
    );
};
