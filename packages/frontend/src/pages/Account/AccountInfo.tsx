import * as React from 'react';
import {useState} from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Button, Container, Paper, Typography} from '@material-ui/core';
import {Col} from 'pages/Base/Grid';
import {AccountUpdate} from './AccountUpdate';
import {subscription} from '@truecost/shared';

export const AccountInfo: React.FC = () => {
    const {current: {user, discount}} = useStore();
    const [showUpdate, setShowUpdate] = useState(false);

    const subscriptionInfo = () => (
        discount > 0 && (
            <Col>
                <Typography variant="caption">Discount:</Typography>
                <Typography>{`${discount} %`}</Typography>
                <Typography>{`${subscription.timeLeft(user)} day(s) left`}</Typography>
            </Col>
        )
    );

    if (!user) {
        return null;
    }

    return (
        <Container maxWidth="sm">
            <Col fullWidth s={16}>
                <Paper>
                    <Col p={16} s={8}>
                        <Col>
                            <Typography variant="caption">Email:</Typography>
                            <Typography>{user.email}</Typography>
                        </Col>
                        <Col>
                            <Typography variant="caption">Username:</Typography>
                            <Typography>{user.name}</Typography>
                        </Col>
                        {subscriptionInfo()}
                    </Col>
                </Paper>
                <Button fullWidth
                        onClick={() => setShowUpdate(!showUpdate)}>
                    Change info
                </Button>
                {showUpdate &&
                <AccountUpdate
                    onUpdate={() => setShowUpdate(false)}/>}
            </Col>
        </Container>
    );
};
