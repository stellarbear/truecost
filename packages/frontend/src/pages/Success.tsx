import React, {useContext, useEffect} from "react";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {Button, Typography} from "@material-ui/core";
import {CartContext} from "./Base/CartWrapper";
import Meta from "./Base/Meta";

type ISuccessProps = RouteComponentProps;

const Success: React.FC<ISuccessProps> = ({
                                              history,
                                          }) => {
    const {cart: {clear}} = useContext(CartContext);

    useEffect(() => clear(), []);

    return (
        <div style={{
            padding: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <Meta page="success"/>
            <React.Fragment>
                <Typography style={{textAlign: "center", marginTop: 20}}>The purchase was successful!</Typography>
                <Typography style={{textAlign: "center", marginTop: 4}}>Further instructions sent by mail.</Typography>
                <Typography style={{textAlign: "center", marginTop: 4}}>We really appreciate that you have chosen our
                    service.</Typography>
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
            </React.Fragment>
        </div>
    );
};

export default withRouter(Success);
