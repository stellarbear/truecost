import * as React from 'react';
import {gql} from 'apollo-boost';
import {useStore} from 'pages/Data/Wrapper';
import {useQuery} from 'react-apollo';
import {Paper} from '@material-ui/core';

const GET_INFO = gql`
    query InfoAll {
        InfoAll {
            id
            name
            order
            active

            text
            redirect
            images

            tag  { id }
            item  { id }
            game  { id }
        }
    }
`

export const HomeInfo = () => {
    const {current: {game}} = useStore();
    const {data, loading, error} = useQuery(GET_INFO, {variables: {game: game.id}});

    debugger;

    return (
        <Paper elevation={6} style={{minHeight: 348}}>

        </Paper>
    )
}