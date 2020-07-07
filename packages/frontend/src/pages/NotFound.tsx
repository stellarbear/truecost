import React, {useEffect, useContext} from "react";
import {Button, Typography} from "@material-ui/core";
import {RouteComponentProps} from "react-router";
import {baseGame, baseUri} from "auxiliary/route";
import {Link, withRouter} from "react-router-dom";
import Meta from "./Base/Meta";
import {DataContext} from "./Data/Wrapper";

type NotFoundProps = RouteComponentProps;

const NotFound: React.FC<NotFoundProps> = ({staticContext}): JSX.Element => {

    //TODO: better handling with failure recovery
    const {current: {game}} = useContext(DataContext);
    const current = game!;
    const image = `${baseUri}/${current.id}/${current.assistant}/u.png`;
    if (staticContext) {
        staticContext.statusCode = 404;
    }

    useEffect(() => {
        window.history.replaceState("", "", `/404`);
    }, []);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
        }}>
            <Meta page="404"/>
            <img className="float" style={{
                minWidth: 80,
                width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
            }} src={image}/>
            <div style={{marginLeft: 8}}>
                <Typography>Unfortunately, page is not found</Typography>
                <Typography>Try next time, may be you will find something interesting!</Typography>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: 16,
                }}>
                    <Button style={{margin: 8}} variant="outlined" component={Link} to="/shop">To the shop!</Button>
                    <Button style={{margin: 8}} variant="outlined" component={Link} to="/account">To the
                        orders!</Button>
                </div>
            </div>
        </div>
    );
};

export default withRouter(NotFound);
