import {CategoryEntity} from "./category.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {CategoryService} from "./category.service";
import {CategoryInput} from "./category.input";


@ObjectType()
class CategoryResponse extends PaginatedResponse(CategoryEntity) {
}

@Resolver(() => CategoryEntity)
export class CategoryCRUDResolver extends BaseResolver
    <typeof CategoryEntity, typeof CategoryInput, typeof CategoryResponse, CategoryInput>

(
    {

        inputRef: CategoryInput,
        classRef: CategoryEntity,
        resultRef: CategoryResponse,
        get: {
            set: ["active"],
            between: ["order"],
            like: ["name"],
            filter: ["game"],
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
        super(new CategoryService());
    }
}
