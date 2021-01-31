import {ConfigEntity} from "./config.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {ConfigService} from "./config.service";
import {ConfigInput} from "./config.input";


@ObjectType()
class ConfigResponse extends PaginatedResponse(ConfigEntity) {
}

@Resolver(() => ConfigEntity)
export class ConfigCRUDResolver extends BaseResolver
    <typeof ConfigEntity, typeof ConfigInput, typeof ConfigResponse, ConfigInput>

(
    {

        inputRef: ConfigInput,
        classRef: ConfigEntity,
        resultRef: ConfigResponse,
        get: { },
        upsert: {
            notEmpty: ["data"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new ConfigService());
    }
}
