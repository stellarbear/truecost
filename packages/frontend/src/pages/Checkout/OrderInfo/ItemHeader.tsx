import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {IconButton, Typography} from '@material-ui/core';
import {PriceTypography} from 'pages/Base/PriceTypography';
import DeleteIcon from '@material-ui/icons/Delete';
import {CalcResult, IItem, Time} from '@truecost/shared';

interface IProps {
    item: IItem;
    total: CalcResult;
    quantity: number;
    chunk?: [number, number];
    onDelete: () => void;
}

export const ItemHeader: React.FC<IProps> = (props) => {
    const {item, quantity, total, onDelete, chunk} = props;
    return (
        <Row fullWidth between>
            <Row>
                <IconButton style={{marginLeft: -12}} onClick={() => onDelete()}>
                    <DeleteIcon/>
                </IconButton>
                <Col left>
                    <Typography>
                        {item.name}
                    </Typography>
                    <Col s={-6} left>
                        {item.range.d.length > 0 && chunk && (
                            <Typography variant={"caption"}>
                                {`from: ${chunk[0]} to: ${chunk[1]}`}
                            </Typography>
                        )}
                        <Typography variant={"caption"}>
                            {`eta: ${Time.fromItem(item, chunk).multiply(quantity).toString}`}
                        </Typography>
                        <Typography variant={"caption"}>
                            {`count: ${quantity}`}
                        </Typography>
                    </Col>
                </Col>
            </Row>
            <Col>
                <PriceTypography price={total.value * quantity}
                                 discount={item.discount * quantity}/>
            </Col>
        </Row>
    );
};
