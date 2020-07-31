import {BlogCRUDResolver} from "./crud/blog/blog.resolver";
import {UserCRUDResolver} from "./crud/user/user.resolver";
import {BookingCRUDResolver} from "./crud/booking/booking.resolver";
import {AccountResolver} from "./other/user/account";
import {SessionResolver} from "./other/user/session";
import {TagCRUDResolver} from "./crud/tag/tag.resolver";
import {GameCRUDResolver} from "./crud/game/game.resolver";
import {ItemCRUDResolver} from "./crud/item/item.resolver";
import {OptionCRUDResolver} from "./crud/option/option.resolver";
import {InfoCRUDResolver} from "./crud/info/info.resolver";
import {BookingResolver} from "./other/booking";
import {PaymentResolver} from "./other/payment";

const resolvers = [
    PaymentResolver,
    BlogCRUDResolver, BookingResolver,
    UserCRUDResolver, BookingCRUDResolver,
    AccountResolver, SessionResolver,
    TagCRUDResolver, GameCRUDResolver, ItemCRUDResolver,
    OptionCRUDResolver, InfoCRUDResolver,
];

export {resolvers};