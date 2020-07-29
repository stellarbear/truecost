import React, {useEffect, useContext} from "react";
import {Button, Typography} from "@material-ui/core";
import {RouteComponentProps} from "react-router";
import {Link, withRouter} from "react-router-dom";
import Meta from "./Base/Meta";
import {DataContext, useStore} from "./Data/Wrapper";
import {InfoCard} from "./Base/InfoCard";

type NotFoundProps = RouteComponentProps;

const NotFound: React.FC<NotFoundProps> = ({staticContext}): JSX.Element => {
    const {current: {game}} = useStore();
    const url = '/' + game.url
    
    if (staticContext) {
        staticContext.statusCode = 404;
    }

    useEffect(() => {
        window.history.replaceState("", "", `/404`);
    }, []);

    return (
        <InfoCard text={[
            'Unfortunately, page is not found',
            'Try next time, may be you will find something interesting!'
        ]} actions={[
            <Button variant="outlined" component={Link} to={url + '/shop'}>To the shop!</Button>,
        ]}/>
    );
};

export default withRouter(NotFound);
