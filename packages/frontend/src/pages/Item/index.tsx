import React, {useContext} from "react";
import {Redirect, useParams, useLocation} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {ItemLanding} from "./ItemLanding";
import {Meta} from "pages/Base/Meta";
import {backend, frontend} from "auxiliary/route";

export const Item: React.FC = () => {
    const location = useLocation();
    const {url: itemUrl} = useParams<{url: string}>();
    const {current: {shop, game}} = useContext(DataContext);
    const {items} = shop();

    if (itemUrl === undefined || !(itemUrl in items.url)) {
        return <Redirect to="/404" />;
    }

    const itemId = items.url[itemUrl];
    const item = items.id[itemId];

    const date = new Date(new Date().getFullYear() + 1, 0, 1).toJSON().slice(0, 10);
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "Garden of Salvation",
        "image": `${`${backend.uri}/${item.id}/${item.images[0]}/u.webp`}`,
        "description": `You will obtain: ${item.obtain?.replace("\n", ", ")}`,
        "brand": `${game.name}`,
        "offers": {
            "@type": "Offer",
            "url": `${frontend.uri}${location.pathname}`,
            "priceCurrency": "USD",
            "price": `${item.price}`,
            "priceValidUntil": `${date}`,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
        },
    };

    return (
        <>
            <Meta entity={item}>
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Meta>
            <ItemLanding item={item} />
        </>
    );
};
