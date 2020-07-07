import React, {useContext, useEffect, useState} from "react";
import {Chip, CircularProgress, createStyles, makeStyles, Theme, Typography} from "@material-ui/core";

import {CartContext} from "pages/Base/CartWrapper";
import gql from "graphql-tag";
import {useQuery} from "react-apollo";
import OrderPanel, {Order} from "./Base/OrderPanel";
import {Redirect} from "react-router-dom";
import {IUser} from "./Base/UserWrapper";
import Meta from "./Base/Meta";
import {DataContext} from "./Data/Wrapper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            maxWidth: 600,
            flexDirection: "row",
            backgroundColor: "white",
            boxShadow:
                "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
            [theme.breakpoints.down(658)]: {
                margin: "0px 10px 10px",
            },
            [theme.breakpoints.up(658)]: {
                margin: "0px auto 30px",
            },
            [theme.breakpoints.up(1600)]: {
                margin: "0px auto 30px",
            },
        },
        font: {
            marginTop: 4,
        },
    }),
);

interface IAccountProps {
}

const GET_ORDERS = gql`
    query userGetOrders {
        userGetOrders{
            id
            name
            details
            createdAt
            metadata
            status
            preview
            history
        }
    }
`;

const Account: React.FC<IAccountProps> = () => {
    const classes = useStyles();
    const {store: {user}} = useContext(DataContext);
    const {store: {passList}} = useContext(CartContext);
    const {data, loading, error} = useQuery(GET_ORDERS, {fetchPolicy: 'cache-and-network'});
    const [orders, setOrders] = useState<Order[]>([]);

    if (user === undefined) {
        <Redirect to={"/login"}/>;
    }

    useEffect(() => {
        if (data?.userGetOrders) {
            const newOrders = data.userGetOrders;
            newOrders.sort((a: any, b: any) => b.createdAt - a.createdAt);

            setOrders(newOrders);
        }
    }, [data]);

    const renderPasses = () => {
        const {total, pass} = user as IUser;

        if (Object.keys(pass).length === 0) {
            return null;
        }

        return (
            <div className={classes.margin}
                 style={{
                     overflow: "hidden",
                     borderRadius: 6,
                     padding: 16, display: "flex", flexDirection: "column", alignItems: "flex-end",
                 }}
            >{
                Object.keys(pass).map((key, i) => {
                    const {discount, name} = passList[key];
                    const timeLeft = Math.ceil((pass[key] - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                        <div key={`pass-${i}`}
                             style={{
                                 marginTop: 8,
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "space-between",
                                 width: "100%",
                             }}>
                            <Typography style={{marginLeft: 8}}
                                        variant="body2">{timeLeft > 1 ? `${timeLeft} d. left` : `expires today`}</Typography>
                            <Chip color="primary"
                                  label={`${discount} % ${name} discount`}/>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderOrders = () => {
        if (loading || error) {
            return <CircularProgress/>;
        }

        if (orders.length === 0) {
            return null;
        }

        return (
            <div className={classes.margin}
                 style={{
                     overflow: "hidden",
                     borderRadius: 6,
                     padding: 16,
                     paddingBottom: 8,
                     display: "flex", flexDirection: "column", alignItems: "flex-end",
                 }}
            >
                {orders.map((order, i) => (
                    <div key={`order-${i}`} style={{width: "100%", marginBottom: 8}}>
                        <OrderPanel order={order}/>
                    </div>
                ))}
            </div>
        );
    };

    const renderInfo = () => {
        return (
            <div className={classes.margin}
                 style={{
                     overflow: "hidden",
                     borderRadius: 6,
                     padding: 16, display: "flex", flexDirection: "column", alignItems: "flex-end",
                 }}
            >
                <Typography>{user!.name}</Typography>
                <Typography variant="caption">{user!.id}</Typography>
                <Typography variant="caption">{user!.email}</Typography>
            </div>
        );
    };

    return (
        <React.Fragment>
            <Meta page="account"/>
            {renderInfo()}
            {renderPasses()}
            {renderOrders()}
        </React.Fragment>
    );
};

export default Account;
