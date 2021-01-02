import * as React from 'react';
import { useStore } from 'pages/Data/Wrapper';
import { Col, Row } from 'pages/Base/Grid';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { ModalDialog } from 'components/ModalDialog';
import { TOS } from 'pages';
import { ApolloError } from '@apollo/client';
import { ErrorBox } from 'components';
import { Currencies, CurrencyKey } from '@truecost/shared';

interface IProps {
    error?: ApolloError;
    currency: string
    loading: boolean;
    total: number;
}

export const OrderPrice: React.FC<IProps> = (props) => {
    const { loading, total, error, currency } = props;
    const currencyRecord = Currencies[currency as CurrencyKey];

    const price = total;

    return (
        <Col s={8} align="center" fullWidth>
            <Row align="center"
                style={{ cursor: "pointer" }}>
                <Typography variant="caption" color="secondary">
                    {`You agree with\u00A0`}
                </Typography>
                <ModalDialog
                    button={
                        <Typography variant="caption" style={{ textDecoration: "underline" }}>
                            Terms of use
                        </Typography>
                    }
                    content={
                        [
                            <TOS key={0} />,
                        ]
                    }
                />
            </Row>
            <Button
                disabled={price === 0}
                style={{ minHeight: 60 }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth >
                {loading
                    ? <CircularProgress size={24} style={{color:"white"}}/>
                    : (
                        <Row fullWidth justify="space-around">
                            <Typography variant="button" style={{ fontSize: "1.4rem" }}>
                                {`Check out`}
                            </Typography>
                            <Typography variant="button" style={{ fontSize: "1.4rem" }}>
                                <strong>
                                    {`${price} ${currencyRecord.label}`}
                                </strong>
                            </Typography>
                        </Row>
                    )
                }
            </Button>
            <ErrorBox error={error} />
        </Col >
    );
};
