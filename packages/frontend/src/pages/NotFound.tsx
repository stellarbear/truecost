import React, {useEffect} from "react";
import {Button} from "@material-ui/core";
import {RouteComponentProps} from "react-router";
import {Link, withRouter} from "react-router-dom";
import {useStore} from "./Data/Wrapper";
import {InfoCard} from "./Base/InfoCard";
import {Meta} from "./Base/Meta";

type IProps = RouteComponentProps;

const NotFound: React.FC<IProps> = ({staticContext}) => {
    const {current: {game}} = useStore();
    const url = '/' + game.url;

    if (staticContext) {
        staticContext.statusCode = 404;
    }

    useEffect(() => {
        window.history.replaceState("", "", `/404`);
    }, []);

    return (
        <>
            <Meta path={"/404"}/>
            <InfoCard text={[
                'Unfortunately, page is not found',
                'Try next time, may be you will find something interesting!',
            ]} actions={[
                <Button key="shop" variant="outlined" component={Link} to={url + '/shop'}>To the shop!</Button>,
            ]}/>
        </>
    );
};

export default withRouter(NotFound);
