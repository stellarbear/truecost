import { Typography, Card, Box, Divider } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Currencies, CurrencyKey } from '@truecost/shared';
import { SafeJSON } from 'auxiliary/json';
import { Col, Row } from 'pages/Base/Grid';
import * as React from 'react';

interface IProps {
    data: {
        currency: string;
        total: string;
        game: string;
        data: string;
    };
}

interface IShape {
    amount: number;
    quantity: number;
    name: string;
    description: string;
}

export const OrderDetails: React.FC<IProps> = (props) => {
    const { data } = props;

    const renderOrder = () => {
        try {

            const { currency, data: order, game } = data;
            const currencyRecord = Currencies[currency as CurrencyKey];
            const { label } = currencyRecord;

            const parsed = SafeJSON.parse<IShape[]>(order, []);

            return (
                <Col s={16}>
                    <Row justify="space-between" align="center">
                        <Typography>Game</Typography>
                        <Typography>{`${game}`}</Typography>
                    </Row>
                    <Divider />
                    {parsed.map((p, id) => (
                        <Row justify="space-between" align="center" key={id}>
                            <Col>
                                <Typography>{`${p.name} x ${p.quantity}`}</Typography>
                                <Typography variant="caption">{`${p.description}`}</Typography>
                            </Col>
                            <Typography>{`${p.amount} ${label}`}</Typography>
                        </Row>
                    ))}
                </Col>
            );

        } catch (e) {
            console.log(e);
            return (
                <Box>
                    <Alert severity="error">Order structure is invalid, contact us for more details!</Alert>
                </Box>
            );
        }

    };

    return (
        <>
            <Row>
                <Typography variant="caption">Order details</Typography>
            </Row>
            <Card style={{ padding: 20 }}>
                {renderOrder()}
            </Card>
        </>
    );
};