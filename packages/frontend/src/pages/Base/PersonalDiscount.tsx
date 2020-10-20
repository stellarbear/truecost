import {Typography, Button, Card} from '@material-ui/core';
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
            <Row s={16} p={[8, 16]} justify="center" align="center">
                <Typography
                    variant="h6" component="p" color="inherit">Get your personal discount plan up&nbsp;to</Typography>
                <Button
                    component={Link}
                    to="/discount"
                    variant="contained"
                    color="secondary">
                    <Typography variant="h6" component="p" color="inherit">{`${max} % discount `}</Typography>
                </Button>
            </Row>
        </Card>
    );
};