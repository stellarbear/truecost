import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {IconButton, Typography} from '@material-ui/core';
import {PriceTypography} from 'pages/Base/PriceTypography';
import DeleteIcon from '@material-ui/icons/Delete';
import {CalcResult, IItem, Time} from '@truecost/shared';
import {backend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';

interface IProps {
    item: IItem;
    total: CalcResult;
    quantity: number;
    chunk?: [number, number];
    onDelete: () => void;
}

export const ItemHeader: React.FC<IProps> = (props) => {
    const {item, quantity, total, onDelete, chunk} = props;
    const image = `${backend.uri}/${item.id}/${item.images[0]}/u.png`;
    return (
        <Row justify="space-between" fullWidth align="center">
            <Row align="center" s={16}>
                <SafeImage
                    style={{minWidth: 64}}
                    alt={`${item.name} thumbnail`}
                    height={64}
                    width={64}
                    src={image}
                />
                <Col >
                    <Typography>
                        {item.name}
                    </Typography>
                    <Col>
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
            <Row align="center" s={16}>
                <PriceTypography price={total.value * quantity}
                    discount={item.discount * quantity} />
                <IconButton style={{marginLeft: -12}} onClick={() => onDelete()}>
                    <DeleteIcon />
                </IconButton>
            </Row>
        </Row>
    );
};
