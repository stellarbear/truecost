import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Button, CircularProgress, Typography} from '@material-ui/core';
import {ModalDialog} from 'components/ModalDialog';
import {TOS} from 'pages';
import {ApolloError} from '@apollo/client';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import {ITotalResult} from '../helper';

interface IProps {
    error?: ApolloError;
    loading: boolean;
    total: ITotalResult;
}

export const EmailPrice: React.FC<IProps> = (props) => {
    const {loading, total, error} = props;
    const {currency} = useStore();

    const {
        price,
        subscriptionDiscount,
        adjustedSubscriptionPrice,
        cartPrice,
    } = total;

    return (
        <Col s={8} align="center" fullWidth>
            <Button
                disabled={price === 0}
                style={{minHeight: 60}}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth >
                {loading
                    ? <CircularProgress size={24} style={{color: "white"}} />
                    : (
                        <Row fullWidth justify="space-around">
                            <Typography variant="button" style={{fontSize: "1.4rem"}}>
                                {`Check out`}
                            </Typography>
                            <Typography variant="button" style={{fontSize: "1.4rem"}}>
                                <strong>
                                    {`${price} ${currency.label}`}
                                </strong>
                            </Typography>
                        </Row>
                    )
                }
            </Button>
            {error && (
                <Col style={{marginTop: 8}} fullWidth>
                    <Alert severity="error">{parseApolloError(error).asString()}</Alert>
                </Col>
            )}
            <Row align="center"
                style={{cursor: "pointer"}}>
                <Typography variant="caption" color="secondary">
                    {`You agree with\u00A0`}
                </Typography>
                <ModalDialog
                    button={
                        <Typography variant="caption" style={{textDecoration: "underline"}}>
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
        </Col >
    );
};
