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
            set: ["active"],
            like: ["name"],
        },
        upsert: {
            notEmpty: [],
        },
    },
)
{
    constructor()
    {
        super(new InfoService());
    }
}
