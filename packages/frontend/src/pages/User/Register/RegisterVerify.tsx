import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {useParams, Redirect} from 'react-router';
import {gql} from 'apollo-boost';
import {useLoading} from 'components/wrappers/LoadingWrapper';
import {useQuery, useLazyQuery, useMutation} from 'react-apollo';
import {Button, Box, CircularProgress} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {Alert} from '@material-ui/lab';
import {Link} from 'react-router-dom';

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
    const {update: {setUser}} = useStore()
    const {verify, value} = useParams();
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
            setUser(data.UserVerify)
        }
    }, [data?.UserVerify])


    if (!verify || !value) {
        return <Redirect to="/404"/>
    }

    if (error) {
        return <Redirect to="/404"/>
    }

    if (loading) {
        return (
            <Box mt={2}>
                <CircularProgress
                    disableShrink color="inherit"/>
            </Box>
        )
    }

    return (
        <>
            <InfoCard text={[
                'You account is verified!',
                'We have automatically logged you in.'
            ]} actions={[
                <Button variant="outlined" component={Link} to="/shop">To the shop!</Button>,
            ]}/>
        </>
    )
}
