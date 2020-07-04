import {BlogCRUDResolver} from "./crud/blog/blog.resolver";
import {GameResolver} from "./other/game/game";
import {UserCRUDResolver} from "./crud/user/user.resolver";
import {BookingCRUDResolver} from "./crud/booking/booking.resolver";
import {AccountResolver} from "./other/user/account";
import {SessionResolver} from "./other/user/session";
import {TagCRUDResolver} from "./crud/tag/tag.resolver";
import {GameCRUDResolver} from "./crud/game/game.resolver";
import {ItemCRUDResolver} from "./crud/item/item.resolver";
import {OptionCRUDResolver} from "./crud/option/option.resolver";
import {CategoryCRUDResolver} from "./crud/category/category.resolver";
import {InfoCRUDResolver} from "./crud/info/info.resolver";

const resolvers = [
    BlogCRUDResolver,
    GameResolver,
    UserCRUDResolver, BookingCRUDResolver,
    AccountResolver, SessionResolver,
    TagCRUDResolver, GameCRUDResolver, ItemCRUDResolver,
    OptionCRUDResolver, CategoryCRUDResolver, InfoCRUDResolver,
];

export {resolvers};