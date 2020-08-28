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
            set: ["topOffer", "direct"],
            like: ["obtain", "requirements", "link", "url"],
            between: ["price", "discount", "limit", "eta"],
            filter: ["game", "tag", "option", "item"],
        },
        upsert: {
            notEmpty: ["images", "price", "game", "url"],
            unique: ["url"],
            images: ["images"],
            propagate: ["option", "tag"],
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
