import {ItemEntity} from "./item.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver, MetaResolver} from "../base/base.resolver";
import {ItemService} from "./item.service";
import {ItemInput} from "./item.input";


@ObjectType()
class ItemResponse extends PaginatedResponse(ItemEntity) {
}

@Resolver(() => ItemEntity)
export class ItemCRUDResolver extends MetaResolver
    <typeof ItemEntity, typeof ItemInput, typeof ItemResponse, ItemInput>

(
    {

        inputRef: ItemInput,
        classRef: ItemEntity,
        resultRef: ItemResponse,
        get: {
            set: ["topOffer"],
            like: ["obtain", "requirements", "link"],
            between: ["price", "discount", "limit"],
            filter: ["game", "tag", "option", "item"],
        },
        upsert: {
            notEmpty: ["images", "price", "game"],
            unique: [],
            images: ["images"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new ItemService());
    }
}
