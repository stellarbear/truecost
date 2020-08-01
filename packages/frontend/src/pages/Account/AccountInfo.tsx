import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Container, Box, Button, Typography, Paper} from '@material-ui/core';
import {Col} from 'pages/Base/Grid';
import {gql} from 'apollo-boost';
import {error} from 'console';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import {useState} from 'react';
import {AccountUpdate} from './AccountUpdate';

export const AccountInfo: React.FC = () => {
    const {current: {user}} = useStore();
    const [showUpdate, setShowUpdate] = useState(false)

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