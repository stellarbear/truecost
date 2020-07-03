import React from "react";
import {CartContext} from "pages/Base/CartWrapper";
import {ShoppingCart} from "@material-ui/icons";
import {Badge, IconButton} from "@material-ui/core";
import {Link} from "react-router-dom";

interface ICartProps {
}

const Cart: React.FC<ICartProps> = ({}) => {

    const {cart: {data}} = React.useContext(CartContext);

    return (
        <IconButton component={Link} to={"/checkout"} color="inherit">
            <Badge
                color="error"
                badgeContent={Object.keys(data.items).length}>
                <ShoppingCart/>
            </Badge>
        </IconButton>
    );
};

export default Cart;
