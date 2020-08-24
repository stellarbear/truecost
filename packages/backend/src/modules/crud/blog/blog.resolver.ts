import {BlogEntity} from "./blog.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BlogService} from "./blog.service";
import {BlogInput} from "./blog.input";
import {BaseResolver} from "../base/base.resolver";


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
            set: [],
            like: ["text", "preview", "url"],
        },
        upsert: {
            notEmpty: ["url"],
            unique: ["url"],
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
