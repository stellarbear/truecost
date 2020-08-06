import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Container, Box, Button, Typography, Paper} from '@material-ui/core';
import {Col} from 'pages/Base/Grid';
import {useState} from 'react';
import {AccountUpdate} from './AccountUpdate';
import {subscription} from '@truecost/shared';

export const AccountInfo: React.FC = () => {
    const {current: {user, discount}} = useStore();
    const [showUpdate, setShowUpdate] = useState(false)

    const subscriptionInfo = () => (
        discount > 0 && (
            <Col left>
                <Typography variant="caption">Discount:</Typography>
                <Typography>{`${discount} %`}</Typography>
                <Typography>{`${subscription.timeLeft(user)} day(s) left`}</Typography>
            </Col>
        )
    )

    return (
        <Container maxWidth="sm">
            <Col fullWidth s={16}>
                <Paper>
                    <Col p={16} s={8} left>
                        <Col left>
                            <Typography variant="caption">Email:</Typography>
                            <Typography>{user!.email}</Typography>
                        </Col>
                        <Col left>
                            <Typography variant="caption">Username:</Typography>
                            <Typography>{user!.name}</Typography>
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
                        onUpdate={() => setShowUpdate(false)} />}
            </Col>
        </Container>
    )
}