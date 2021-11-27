import {Arg, Ctx, Query, Resolver} from "type-graphql";
import {Context} from "../../../server";
import {creds} from "../../../helpers/creds";
import {assert} from "../../../helpers/assert";
import * as paypal from '@paypal/checkout-server-sdk';
import {createOrder} from "../webhook";
@Resolver()
export class BookingAcceptResolver {

    @Query(() => String)
    async BookingPaypalAccept(
        @Ctx() ctx: Context,
        @Arg("token") token: string,
    ) {
        const {id, secret} = creds("paypal");
        const environment = new paypal.core.LiveEnvironment(id, secret);
        const client = new paypal.core.PayPalHttpClient(environment);
        const confirm = new paypal.orders.OrdersCaptureRequest(token);

        const confirmResponse = await client.execute(confirm);
        assert(confirmResponse.result.status === "COMPLETED",
            "paypal order failure (code: payment not processed)");


        const bookingId = confirmResponse.result?.purchase_units?.[0]?.payments?.captures?.[0]?.invoice_id;
        assert(bookingId,
            "booking id missing. contact us.");

        const order = await createOrder(bookingId, 'paypal');

        return order.code;
    }

    @Query(() => String)
    async BookingStripeAccept(
        @Ctx() ctx: Context,
        @Arg("token") token: string,
    ) {
        const order = await createOrder(token, 'stripe');

        return order.code;
    }
}
