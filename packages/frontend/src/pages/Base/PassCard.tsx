import React, {useContext} from "react";
import {CartContext} from "./CartWrapper";
import {Button, Card, Hidden, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import "css/float.css";
import {baseGame} from "auxiliary/route";

interface IPassCardProps {
}

const PassCard: React.FC<IPassCardProps> = () => {
    const {store: {passList}, math: {collectDiscounts}} = useContext(CartContext);
    const maxDiscount = collectDiscounts([], Object.keys(passList)).discount;

    return (
        <Card style={{
            margin: "4px 12px",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexWrap: "wrap",
        }}>
            <Hidden smDown>
                <img className="float" style={{
                    minWidth: 80,
                    width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
                }} src={`/${baseGame}/pass.png`}/>
            </Hidden>

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                <Typography variant="h5" color="inherit"
                            style={{textAlign: "center"}}>{`Do not forget about your personal`}</Typography>
                <Typography variant="h5" color="secondary"
                            style={{whiteSpace: 'pre'}}>{` up to ${maxDiscount}% discount !`}</Typography>
            </div>

            <Button
                style={{margin: 8, marginRight: 0}}
                component={Link}
                to="discount"
                variant="contained"
                color="secondary">
                Learn more
            </Button>
        </Card>
    );
};

export default PassCard;
