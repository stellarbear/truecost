import React from "react";
import {Redirect, useParams, useLocation, RouteComponentProps} from "react-router-dom";
import {useStore} from "pages/Data/Wrapper";
import {ItemLanding} from "./ItemLanding";
import {Meta} from "pages/Base/Meta";
import {backend, frontend} from "auxiliary/route";
import { extractGame } from "pages/Data/useGame";

type IProps = RouteComponentProps;

export const Item: React.FC<IProps> = ({staticContext}) => {
    const location = useLocation();
    const {games, config, current: {shop, game}, update: {setGame}} = useStore();
    const {url: itemUrl} = useParams<{url: string}>();
    const {items} = shop();

    if (itemUrl === undefined || !(itemUrl in items.url)) {
        const redirects = config.redirect ?? {};
        if (location.pathname in redirects) {
            const to = redirects[location.pathname];
            if (staticContext){
                staticContext.statusCode = 301;
            }
            setGame(extractGame(to, games));
            return <Redirect to={to} />;
        } else {
            return <Redirect to="/404" />;
        }
    }

    const itemId = items.url[itemUrl];
    const item = items.id[itemId];

    const rate = item.rate || 0;
    const buy = item.buy || 0;
    const rating = Math.min(5, Math.max(0, rate / (buy || 1)));
    const date = new Date(new Date().getFullYear() + 1, 0, 1).toJSON().slice(0, 10);

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": `${item.name}`,
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
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": `${rating}`,
            "reviewCount": `${buy}`,
        },
    };

    return (
        <>
            <Meta entity={item}>
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Meta>
            <ItemLanding item={item} rating={rating}/>
        </>
    );
};
