import * as React from 'react';
import {IItem} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip, Typography} from '@material-ui/core';
import Markdown from 'components/Markdown';
import {Col} from 'pages/Base/Grid';

interface IProps {
    item: IItem
}

export const ItemObtain: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id

    if (!item.obtain || item.obtain.length === 0) {
        return null;
    }

    return (
        <Col left>
            <Typography variant="body1">You will obtain:</Typography>
            {
                item.obtain.split('\n').map((o, i) => (
                    <Markdown key={`${itemId}-obtain-${i}`} >
                        {`• ${o}`}
                    </Markdown>
                ))
            }
        </Col>
    )
}