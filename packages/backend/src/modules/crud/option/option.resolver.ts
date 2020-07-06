import {OptionEntity} from "./option.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {OptionService} from "./option.service";
import {OptionInput} from "./option.input";


@ObjectType()
class OptionResponse extends PaginatedResponse(OptionEntity) {
}

@Resolver(() => OptionEntity)
export class OptionCRUDResolver extends BaseResolver
    <typeof OptionEntity, typeof OptionInput, typeof OptionResponse, OptionInput>

    (
        {
            inputRef: OptionInput,
            classRef: OptionEntity,
            resultRef: OptionResponse,
            get: {
                set: ["type", "area", "filter"],
                between: ["price", "free"],
                like: [],
                filter: ["game", "item"],
            },
            upsert: {
                notEmpty: ["price", "game"],
                unique: [],
            },
            restrictPublic: false,
        },
    )
{
    constructor() {
        super(new OptionService());
    }
}
