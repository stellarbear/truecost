import {ItemEntity} from "./item.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {ItemService} from "./item.service";
import {ItemInput} from "./item.input";


@ObjectType()
class ItemResponse extends PaginatedResponse(ItemEntity) {
}

@Resolver(() => ItemEntity)
export class ItemCRUDResolver extends BaseResolver
    <typeof ItemEntity, typeof ItemInput, typeof ItemResponse, ItemInput>

(
    {

        inputRef: ItemInput,
        classRef: ItemEntity,
        resultRef: ItemResponse,
        get: {
            set: ["active", "topOffer"],
            like: ["name", "url", "obtain", "requirements", "link"],
            between: ["price", "discount", "limit"],
            filter: ["game", "tag", "option", "category", "item"],
        },
        upsert: {
            notEmpty: ["active", "name", "url", "images", "price", "game"],
            unique: ["name", "url"],
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
