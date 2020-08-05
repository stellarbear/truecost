import {BaseEntity, BaseMetaEntity} from "./crud/base/base.entity";
import {UserEntity} from "./crud/user/user.entity";
import {BookingEntity} from "./crud/booking/booking.entity";
import {ItemEntity} from "./crud/item/item.entity";
import {BlogEntity} from "./crud/blog/blog.entity";
import {GameEntity} from "./crud/game/game.entity";
import {TagEntity} from "./crud/tag/tag.entity";
import {OptionEntity} from "./crud/option/option.entity";
import {InfoEntity} from "./crud/info/info.entity";
import {SubscriptionEntity} from "./crud/subscription/subscription.entity";

const entities = [
    BaseEntity, BaseMetaEntity,
    UserEntity, BookingEntity,
    SubscriptionEntity,
    ItemEntity, BlogEntity, GameEntity, TagEntity, OptionEntity, InfoEntity,
];

export {entities};