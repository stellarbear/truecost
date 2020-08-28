import {InfoEntity} from "./info.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {InfoService} from "./info.service";
import {InfoInput} from "./info.input";


@ObjectType()
class InfoResponse extends PaginatedResponse(InfoEntity) {
}

@Resolver(() => InfoEntity)
export class InfoCRUDResolver extends BaseResolver
    <typeof InfoEntity, typeof InfoInput, typeof InfoResponse, InfoInput>

(
    {

        inputRef: InfoInput,
        classRef: InfoEntity,
        resultRef: InfoResponse,
        get: {
            like: ["text", "redirect"],
            filter: ["game", "tag", "item"],
        },
        upsert: {
            notEmpty: ["images", "redirect"],
            unique: [],
            images: ["images"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new InfoService());
    }
}
