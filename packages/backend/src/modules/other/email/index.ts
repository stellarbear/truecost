import {Arg, Query, Resolver} from "type-graphql";
import {slack} from "../../../helpers/slack";
import {composeEmail} from "../../../mail/compose";
import {promoEmail} from "../../../mail/samples/promo";
import {BlogEntity} from "../../crud/blog/blog.entity";

@Resolver(() => BlogEntity)
export class EmailResolver {
    @Query(() => Boolean)
    async EmailPromoCode(
        @Arg("email") email: string,
        @Arg("code") code: string,
    ) {
        slack([
            "email collect: ",
            email, code,
        ]);

        await composeEmail({
            to: email,
            template: promoEmail(code),
            subject: 'Promotional code',
            text: `Promotional code`,
        });

        return true;
    }
}
