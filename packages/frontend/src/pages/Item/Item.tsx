import React, {useEffect, useContext} from "react";
import {useParams, Redirect} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {ItemLanding} from "./ItemLanding";

export const Item: React.FC = () => {
    const {url: itemUrl} = useParams();
    const {current: {shop, game: {url}}} = useContext(DataContext);
    const {items,} = shop();

    if (itemUrl === undefined || !(itemUrl in items.url)) {
        return <Redirect to="/404"/>;
    }

    const itemId = items.url[itemUrl];
    const item = items.id[itemId];

    return <ItemLanding item={item}/>
}
