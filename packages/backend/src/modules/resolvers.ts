import {BlogCRUDResolver} from "./crud/blog/blog.resolver";
import {UserCRUDResolver} from "./crud/user/user.resolver";
import {BookingCRUDResolver} from "./crud/booking/booking.resolver";
import {AccountResolver} from "./other/user/account";
import {SessionResolver} from "./other/user/session";
import {TagCRUDResolver} from "./crud/tag/tag.resolver";
import {GameCRUDResolver} from "./crud/game/game.resolver";
import {ItemCRUDResolver} from "./crud/item/item.resolver";
import {OptionCRUDResolver} from "./crud/option/option.resolver";
import {SubscriptionCRUDResolver} from "./crud/subscription/subscription.resolver";
import {InfoCRUDResolver} from "./crud/info/info.resolver";
import {BookingGetResolver, BookingMakeResolver, BookingUpsertResolver} from "./other/booking";
import {PaymentResolver} from "./other/payment";
import {MetaCRUDResolver} from "./crud/meta/meta.resolver";
import {BlogResolver} from "./other/blog";
import {ReviewCRUDResolver} from "./crud/review/review.resolver";
import {EmailResolver} from "./other/email";

const resolvers = [
    BlogResolver,
    PaymentResolver,
    MetaCRUDResolver,
    EmailResolver,
    BlogCRUDResolver, 
    BookingGetResolver, BookingMakeResolver, BookingUpsertResolver,
    SubscriptionCRUDResolver,
    ReviewCRUDResolver,
    UserCRUDResolver, BookingCRUDResolver,
    AccountResolver, SessionResolver,
    TagCRUDResolver, GameCRUDResolver, ItemCRUDResolver,
    OptionCRUDResolver, InfoCRUDResolver,
];

export {resolvers};
