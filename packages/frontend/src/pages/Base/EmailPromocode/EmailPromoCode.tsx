import * as React from 'react';
import {Button, Typography} from '@material-ui/core';
import {Row} from '../Grid';
import {ModalDialog} from 'components/ModalDialog';
import {colors} from 'theme';
import {EmailPromoDialog} from './EmailPromoDialog';

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
                        <div style={{
                            height: 12,
                            width: 12,
                            backgroundColor: colors.accentColor,
                            borderRadius: "50%",
                        }} />
                        <Typography variant="button">
                            Get promo code
                    </Typography>
                    </Row>
                </Button>
            }
            content={
                [
                    <EmailPromoDialog code={code} key={content}/>,
                ]
            }
        />
    );
};