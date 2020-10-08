import * as React from 'react';
import {Row} from 'pages/Base/Grid';
import {IconButton, Typography} from '@material-ui/core';
import {IItem} from '@truecost/shared';
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';
import Link from '@material-ui/icons/Link';
import {useStore} from 'pages/Data/Wrapper';

interface IProps {
    item: IItem;
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
}

export const ItemCount: React.FC<IProps> = ({item, quantity, onAdd, onRemove}) => {
    const {current: {game: {url}}} = useStore();
    const redirect = `/${url}/item/${item.url}`;

    return (
        <Row fullWidth justify="space-between" >
            {
                <a target="_blank" rel="noreferrer" href={redirect}>
                    <IconButton>
                        <Link/>
                    </IconButton>
                </a>
            }
            <Row align="center">
                <IconButton
                    disabled={quantity <= 1}
                    onClick={onRemove}>
                    <Remove/>
                </IconButton>
                <Typography variant="h6">{quantity}</Typography>

                <IconButton
                    disabled={item.limit > 0 && quantity >= item.limit}
                    onClick={onAdd}>
                    <Add/>
                </IconButton>
            </Row>
        </Row>
    );
};
