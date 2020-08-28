import React, {useContext} from "react";
import {Redirect, useParams} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {ItemLanding} from "./ItemLanding";
import {Meta} from "pages/Base/Meta";

export const Item: React.FC = () => {
    const {url: itemUrl} = useParams<{ url: string }>();
    const {current: {shop}} = useContext(DataContext);
    const {items} = shop();

    if (itemUrl === undefined || !(itemUrl in items.url)) {
        return <Redirect to="/404"/>;
    }

    const itemId = items.url[itemUrl];
    const item = items.id[itemId];

    return (
        <>
            <Meta entity={item}/>
            <ItemLanding item={item}/>
        </>
    );
};
