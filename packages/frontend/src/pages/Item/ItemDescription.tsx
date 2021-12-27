import * as React from 'react';
import {IItem} from "@truecost/shared";
import {Typography} from '@material-ui/core';
import {Markdown} from 'components/Markdown';
import {Col} from 'pages/Base/Grid';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem;
}

export const ItemDescription: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;

    if (!item.description || item.description.length === 0) {
        return null;
    }

    return (
        <>
            <Col>
                <Typography variant="body1">Description:</Typography>
                {
                    item.description.split('\n').map((o, i) => (
                        <Markdown key={`${itemId}-description-${i}`}>
                            {`• ${o}`}
                        </Markdown>
                    ))
                }
            </Col>
            <ItemDivider condition={item.description.length > 0}/>
        </>
    );
};
