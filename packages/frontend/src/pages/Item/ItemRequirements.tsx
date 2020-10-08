import * as React from 'react';
import {IItem} from "@truecost/shared";
import {Typography} from '@material-ui/core';
import Markdown from 'components/Markdown';
import {Col} from 'pages/Base/Grid';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem;
}

export const ItemRequirements: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;

    if (!item.requirements || item.requirements.length === 0) {
        return null;
    }

    return (
        <>
            <Col>
                <Typography variant="body1">Requirements:</Typography>
                {
                    item.requirements.split('\n').map((o, i) => (
                        <Markdown key={`${itemId}-requirements-${i}`}>
                            {`• ${o}`}
                        </Markdown>
                    ))
                }
            </Col>
            <ItemDivider condition={item.requirements.length > 0}/>
        </>
    );
};
