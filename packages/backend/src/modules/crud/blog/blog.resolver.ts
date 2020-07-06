import {BlogEntity} from "./blog.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {MetaResolver} from "../base/base.resolver";
import {BlogService} from "./blog.service";
import {BlogInput} from "./blog.input";
import {BaseInput, MetaInput} from "../base/base.input";


@ObjectType()
class BlogResponse extends PaginatedResponse(BlogEntity) {}


@Resolver(() => BlogEntity)
export class BlogCRUDResolver extends MetaResolver
    <typeof BlogEntity, typeof BlogInput, typeof BlogResponse, BlogInput>

    (
        {

            inputRef: BlogInput,
            classRef: BlogEntity,
            resultRef: BlogResponse,
            get: {
                set: [],
                like: ["text", "preview"],
            },
            upsert: {
                notEmpty: [],
                unique: [],
                images: ["images"],
            },
            restrictPublic: false,
        },
    )
{
    constructor() {
        super(new BlogService());
    }
}
