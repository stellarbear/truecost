import {Typography, Button, Card, ButtonBase} from '@material-ui/core';
import React from 'react';
import {Link} from 'react-router-dom';
import {Row} from './Grid';
import {useStore} from 'pages/Data/Wrapper';

export const PersonalDiscount: React.FC = () => {
    const {subs} = useStore();
    const max = Math.max(...Object.values(subs).map(s => s.discount));
    return (
        <Card style={{
            color: "#fff",
            backgroundColor: "#263238",
        }}>
            <ButtonBase
                style={{width: "100%"}}
                component={Link}
                to="/discount">
                <Row s={16} p={[8, 16]} wrap justify="center" align="center">
                    <Typography
                        align="center"
                        style={{margin: 8}}
                        variant="h6" component="p" color="inherit">
                        Get your personal discount plan up&nbsp;to
                    </Typography>
                    <Button
                        style={{margin: 8}}
                        variant="contained"
                        color="secondary">
                        <Typography variant="h6" component="p" color="inherit">{`${max} % discount `}</Typography>
                    </Button>
                </Row>
            </ButtonBase>
        </Card>
    );
};