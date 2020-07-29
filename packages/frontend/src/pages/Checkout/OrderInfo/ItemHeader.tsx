import * as React from 'react';
import {Row, Col} from 'pages/Base/Grid';
import {IconButton, Typography} from '@material-ui/core';
import {PriceTypography} from 'pages/Base/PriceTypography';
import DeleteIcon from '@material-ui/icons/Delete';
import {IItem, Price} from '@truecost/shared';

interface IProps {
    item: IItem
    total: Price
    quantity: number
    onDelete: () => void
}

export const ItemHeader: React.FC<IProps> = ({item, quantity, total, onDelete}) => (
    <Row fullWidth between>
        <Row>
            <IconButton style={{marginLeft: -12}} onClick={() => onDelete()}>
                <DeleteIcon />
            </IconButton>
            <Col left>
                <Typography>
                    {item.name}
                </Typography>
                <Typography variant={"caption"}>
                    {`count: ${quantity}`}
                </Typography>
            </Col>
        </Row>
        <Col>
            <PriceTypography price={total.toValue * quantity}
                discount={item.discount * quantity} />
        </Col>
    </Row>
)