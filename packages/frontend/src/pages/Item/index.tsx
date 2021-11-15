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
    //const date = new Date(new Date().getFullYear() + 1, 0, 1).toJSON().slice(0, 10);
    const name = item.name.replace("\n", ", ");

    const schemaBreadCrumbs = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": game.name,
          "item": `${frontend.uri}/${game.url}/`,
        },{
          "@type": "ListItem",
          "position": 2,
          "name": `Shop ${game.name}`,
          "item": `${frontend.uri}/${game.url}/shop`,
        },{
          "@type": "ListItem",
          "position": 3,
          "name": name,
        }],
    };

    const schemaBase = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": name,
        "image": [`${`${backend.uri}/${item.id}/${item.images[0]}/u.webp`}`],
        "description": `If you are looking to buy ${name}, ` + 
            `you're at the right place ✓ 5/5 Score on Trustpilot - Years of experience ✓ The customer is always right.`,
        "brand": {
            "@type": "Brand",
            "name": "TrueCost.gg",
        },
        "review": {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5",
            },
            "author": {
                "@type": "Organization",
                "name": "TrueCost.com",
            },
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": `${rating}`,
            "reviewCount": `${buy}`,
        },
        "offers": {
            "@type": "Offer",
            "url": `${frontend.uri}${location.pathname}`,
            "priceCurrency": "USD",
            "price": `${item.price}`,
            "priceValidUntil": "2029-12-31", 
            "itemCondition": "https://schema.org/UsedCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "TrueCost.com",
            },
        },
    };

    return (
        <>
            <Meta entity={item}>
                <script type="application/ld+json">
                    {JSON.stringify(schemaBreadCrumbs)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(schemaBase)}
                </script>
            </Meta>
            <ItemLanding item={item} rating={rating}/>
        </>
    );
};
