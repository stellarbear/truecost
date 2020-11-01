import {Chip} from '@material-ui/core';
import {IItem} from '@truecost/shared';
import {Row} from 'pages/Base/Grid';
import React from 'react';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem;
}

export const ItemOrdered: React.FC<IProps> = (props) => {
    const {item: {buy}} = props;
    const text = buy
        ? `Alrerady ordered ${buy} times`
        : 'Be the first to order this item!';

    return (
        <>
            <Row justify="flex-end" p={[0, 8]}>
                <Chip
                    label={text}
                    color="secondary"
                    size="small" />
            </Row>
            <ItemDivider condition={true} />
        </>
    );
};