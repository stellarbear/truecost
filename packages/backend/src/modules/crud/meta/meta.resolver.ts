import {MetaEntity} from "./meta.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {MetaService} from "./meta.service";
import {MetaInput} from "./meta.input";


@ObjectType()
class MetaResponse extends PaginatedResponse(MetaEntity) {
}

@Resolver(() => MetaEntity)
export class MetaCRUDResolver extends BaseResolver
    <typeof MetaEntity, typeof MetaInput, typeof MetaResponse, MetaInput>

(
    {

        inputRef: MetaInput,
        classRef: MetaEntity,
        resultRef: MetaResponse,
        get: {
            like: ["url"],
        },
        upsert: {
            notEmpty: ["url"],
            unique: ["url"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new MetaService());
    }
}
