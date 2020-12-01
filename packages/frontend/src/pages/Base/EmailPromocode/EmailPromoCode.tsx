import * as React from 'react';
import {Button, Typography} from '@material-ui/core';
import {Row} from '../Grid';
import {ModalDialog} from 'components/ModalDialog';
import {EmailPromoDialog} from './EmailPromoDialog';
import {Circle} from 'components';

interface IProps {
    code: string;
}

export const EmailPromoCode: React.FC<IProps> = (props) => {
    const {code} = props;

    return (
        <ModalDialog
            button={
                <Button fullWidth
                    style={{height: 48, marginTop: 8}}>
                    <Row s={16} align="center">
                        <Circle />
                        <Typography variant="button">
                            Get 10% discount promo code
                    </Typography>
                    </Row>
                </Button>
            }
            content={
                [
                    <EmailPromoDialog code={code} key="content" />,
                ]
            }
        />
    );
};