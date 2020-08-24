import * as React from 'react';
import {Checkbox, Typography} from '@material-ui/core';
import {Row} from 'pages/Base/Grid';
import {Link} from 'react-router-dom';

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
                <Typography component={Link} to="/tos">
                    Terms of use
                </Typography>
            </Row>
        </div>
    )
}