import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {useParams, Redirect, useHistory} from 'react-router';
import {Button, Box, CircularProgress} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {Meta} from 'pages/Base/Meta';
import {gql, useMutation} from '@apollo/client';

const verifyMutation = gql`
    mutation UserVerify($verify: String!, $value: String!) {
        UserVerify(verify: $verify, value:$value) {
            name
            role
            email
            id
        }
    }
`;


export const RegisterVerify: React.FC = () => {
    const history = useHistory();
    const {verify, value} = useParams<{verify: string, value: string}>();
    const [mutation, {data, error, loading}] = useMutation(verifyMutation);

    React.useEffect(() => {
        const onLoad = async () => {
            if (verify && value) {
                await mutation({variables: {verify, value}});
            }
        }

        onLoad();
    }, []);

    React.useEffect(() => {
        if (data?.UserVerify) {
            if (data.UserVerify) {
                history.push(`/login`);
            } else {
            }
        }
    }, [data?.UserVerify])


    if (!verify || !value) {
        return <Redirect to="/404" />
    }

    if (error) {
        return <Redirect to="/404" />
    }

    if (loading) {
        return (
            <Box mt={2}>
                <CircularProgress
                    disableShrink color="inherit" />
            </Box>
        )
    }

    return (
        <>
            <Meta />
            <InfoCard text={[
                'You account is verified!',
                'We have automatically logged you in.'
            ]} actions={[
                <Button variant="outlined" component={Link} to="/shop">To the shop!</Button>,
            ]} />
        </>
    )
}
