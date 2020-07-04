import {BaseEntity, MetaEntity} from "./crud/base/base.entity";
import {UserEntity} from "./crud/user/user.entity";
import {BookingEntity} from "./crud/booking/booking.entity";
import {ItemEntity} from "./crud/item/item.entity";
import {BlogEntity} from "./crud/blog/blog.entity";
import {GameEntity} from "./crud/game/game.entity";
import {TagEntity} from "./crud/tag/tag.entity";
import {OptionEntity} from "./crud/option/option.entity";
import {CategoryEntity} from "./crud/category/category.entity";
import {InfoEntity} from "./crud/info/info.entity";

const entities = [
    BaseEntity, MetaEntity,
    UserEntity, BookingEntity,
    ItemEntity, BlogEntity, GameEntity, TagEntity, OptionEntity, CategoryEntity, InfoEntity,
];

export {entities};