import {BlogEntity} from "./blog.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {BlogService} from "./blog.service";
import {BlogInput} from "./blog.input";


@ObjectType()
class BlogResponse extends PaginatedResponse(BlogEntity) {
}

@Resolver(() => BlogEntity)
export class BlogCRUDResolver extends BaseResolver
    <typeof BlogEntity, typeof BlogInput, typeof BlogResponse, BlogInput>

(
    {

        inputRef: BlogInput,
        classRef: BlogEntity,
        resultRef: BlogResponse,
        get: {
            set: ["active"],
            like: ["name", "text", "preview", "url"],
        },
        upsert: {
            notEmpty: ["active", "name", "url"],
            unique: ["name", "url"],
            images: ["images"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new BlogService());
    }
}
