import * as React from 'react';
import {Checkbox, Typography} from '@material-ui/core';
import {Row} from 'pages/Base/Grid';
import {Link} from 'react-router-dom';
import {ModalDialog} from 'components/ModalDialog';
import {TOS} from 'pages/TOS';

interface IProps {
    agree: boolean
    toggleAgree: () => void
}

export const EmailAgree: React.FC<IProps> = ({agree, toggleAgree}) => {


    return (
        <div onClick={toggleAgree} style={{cursor: "pointer"}}>
            <Row>
                <Checkbox
                    checked={agree}
                    onChange={() => toggleAgree()}
                />
                <Typography>
                    {`I agree to\u00A0`}
                </Typography>
                <ModalDialog
                    button={
                        <Typography style={{textDecoration: "underline"}}>
                            Terms of use
                        </Typography>
                    }
                    content={
                        [
                            <TOS />
                        ]
                    }
                />
            </Row>
        </div>
    )
}