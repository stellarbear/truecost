import {creds} from "../../../helpers/creds";
import Stripe from 'stripe';
import {frontend} from "../../../helpers/route";
import {IItemShape} from "./helpers";
import {assert} from "../../../helpers/assert";
import * as paypal from '@paypal/checkout-server-sdk';

export const payWithStripe = async (
    id: string,
    url: string,
    email: string,
    items: IItemShape[],
    coupon?: string,
) => {
    const {sk} = creds("stripe");
    const stripe = new Stripe(sk, {apiVersion: '2020-08-27'});
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        ...(coupon ? {
            discounts: [{
                coupon,
            }],
        } : {}),
        metadata: {id},
        locale: "en",
        line_items: items.map(item => ({
            ...item,
            amount: item.amount * 100,
        })),
        success_url: `${frontend.uri}/${url}checkout/stripe/?token=${id}`,
        cancel_url: `${frontend.uri}/${url}checkout`,
    });
    return session.id;
};

export const payWithPaypal = async (
    id: string,
    url: string,
    total: {
        total: number;
        discount: number;
        discounted: number;
    },
    currency: string,
    items: IItemShape[],
) => {
    const {id: pid, secret} = creds("paypal");
    const environment = new paypal.core.LiveEnvironment(pid, secret);
    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.orders.OrdersCreateRequest();
    
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": currency,
                    "value": total.discounted,
                    "breakdown": {
                        "item_total": {
                            "value": total.total,
                            "currency_code": currency,
                        },
                        ...total.discount ? {
                            "discount": {
                                "currency_code": currency,
                                "value": total.discount,
                            },
                        } : {},
                    },
                },
                "invoice_id": id,
                "items":
                    items.map(({name, quantity, amount, currency}) => ({
                        name,
                        unit_amount: {
                            "currency_code": currency,
                            "value": amount,
                        },
                        quantity,
                    })),
            },
        ],
        "application_context": {
            locale: "en-US",
            landing_page: "BILLING",
            brand_name: "TrueCostGG",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
            return_url: `${frontend.uri}/${url}checkout/paypal`,
            cancel_url: `${frontend.uri}/${url}checkout`,
        },
    });

    const response = await client.execute(request);

    const approval = response.result.links.filter((link: any) => link.rel === 'approve');
    assert(approval.length === 1, "paypal order failure (code: no approval)");
    return approval[0].href;
};