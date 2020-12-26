import {ApolloError} from '@apollo/client';
import {Box} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';
import * as React from 'react';

interface IProps {
    error?: ApolloError;
}

export const ErrorBox: React.FC<IProps> = (props) => {
    const {error} = props;

    return (
        <>
            <Box mt={2}>
                {error && <Alert severity="error">{parseApolloError(error).asString()}</Alert>}
            </Box>
        </>
    );
};