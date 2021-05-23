import {gql} from "@apollo/client";

const base = {
    fragment: `
		id
		name
		order
		active
	`,
};
const game = {
    fragment: `
        game { id }
	`,
};
export const BULK_QUERY = gql`
query DataAll {
MetaAll {
    url
    tags
    active
}

Stripe

UserWhoAmI {
    id
    name
    active

    role
    email

    subscription { id discount days }
    subscribeDate
}

GameAll {
    ${base.fragment}
    seo
    url
    twitter
    background
    assistant
    preview
}
ItemAll {
    ${base.fragment}
    ${game.fragment}
    url
    link
    images
    price
    discount
    limit
    range
    topOffer
    direct
    youtube

    rate
    buy
    eta
    obtain
    requirements

    tag  { id }
    option  { id }
    item  { id }
}

OptionAll {
    ${base.fragment}
    ${game.fragment}
    price
    free
    type
    area
    merge
}
TagAll {
    ${base.fragment}
    ${game.fragment}

    color
    children { id }
}

SubscriptionAll {
    ${base.fragment}
    days
    price
    discount

    description
}

InfoAll {
    id
    name
    order
    active

    cta
    text
    redirect
    images

    tag  { id }
    item  { id }
    game  { id }
}

ConfigAll {
    name
    data
}

ReviewAll {
    id
    who
    text
    title
}
}
`;