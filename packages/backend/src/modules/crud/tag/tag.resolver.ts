import {TagEntity} from "./tag.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {TagService} from "./tag.service";
import {TagInput} from "./tag.input";


@ObjectType()
class TagResponse extends PaginatedResponse(TagEntity) {
}

@Resolver(() => TagEntity)
export class TagCRUDResolver extends BaseResolver
    <typeof TagEntity, typeof TagInput, typeof TagResponse, TagInput>

(
    {

        inputRef: TagInput,
        classRef: TagEntity,
        resultRef: TagResponse,
        get: {
            set: ["active"],
            like: ["name"],
            filter: ["game", "item"],
        },
        upsert: {
            notEmpty: ["active", "name", "game"],
            unique: ["name"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new TagService());
    }
}
