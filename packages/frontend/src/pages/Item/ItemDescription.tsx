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

    if (!item.description || item.description.length === 0) {
        return null;
    }

    return (
        <>
            <Col>
                <Typography variant="body1">Description:</Typography>
                <Markdown>
                    {item.description}
                </Markdown>
            </Col>
            <ItemDivider condition={item.description.length > 0} />
        </>
    );
};
