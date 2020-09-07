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
            url
            twitter
            background
            assistant
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

            text
            redirect
            images

            tag  { id }
            item  { id }
            game  { id }
        }
    }
`;
