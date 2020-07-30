import {Query, Resolver} from "type-graphql";
import {creds} from "../../../helpers/creds";

@Resolver()
export class PaymentResolver {
    @Query(() => String)
    async Stripe() {
        return creds("stripe").pk
    }
}