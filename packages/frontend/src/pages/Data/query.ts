import {gql} from "apollo-boost";

const base = {
    fragment: `
		id
		name
		order
		active
	`,
};
const meta = {
    fragment: `
        ${base.fragment}
        url
        metatag
	`,
};
const game = {
    fragment: `
        game { id }
	`,
};
export const BULK_QUERY = gql`
    query DataAll  {
        Stripe
        UserWhoAmI {
            id
            name

            role
            email
        }
        BlogAll {
            ${meta.fragment}
            preview
            images
            date
        }

        GameAll {
            ${meta.fragment}
            twitter
            background
            assistant
        }
        ItemAll {
            ${meta.fragment}
            ${game.fragment}
            link
            images
            price
            discount
            limit
            single
            range
            topOffer

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
        }
    }
`;