import * as React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import {Select, MenuItem} from '@material-ui/core';
import {sequence} from 'auxiliary/sequence';
import {Row, Col} from 'pages/Base/Grid';
import ItemCard from './ItemCard';
import {InfoCard} from 'pages/Base/InfoCard';

interface IProps {
    ids: string[]
}

export const ItemList: React.FC<IProps> = ({ids}) => {
    const [page, setPage] = React.useState(1);
    const [count, setCount] = React.useState(6);

    const select = () => (
        <Select
            value={count}
            disableUnderline
            renderValue={val => `${val} items`}
            MenuProps={{disableScrollLock: true}}
            onChange={(event) => setCount(event.target.value as number || 6)}
        >
            {sequence(6, (i) => (i + 1) * 6).map((num) =>
                <MenuItem key={num}
                    value={num}>{num}</MenuItem>)}
        </Select>
    )

    const pagination = () => (
        <Pagination
            showLastButton
            showFirstButton
            count={Math.ceil(ids.length / count)} page={page}
            onChange={(_, value) => setPage(value)} />
    )

    const items = () =>
        <Row start wrap>
            {ids.map(id => (
                <ItemCard key={id} id={id} />
            ))}
        </Row>

    if (ids.length === 0) {
        return (
            <InfoCard text={[
                'Unfortunately, nothing was found',
                'Try next time or change some filters'
            ]} />
        )
    }

    return (
        <Col fullWidth>
            <Row start>
                {pagination()}
                {select()}
            </Row>
            {items()}
            <Row start>
                {pagination()}
            </Row>
        </Col>
    )
}