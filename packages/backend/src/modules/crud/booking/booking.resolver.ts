import {BookingEntity} from "./booking.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {BookingService} from "./booking.service";
import {BookingInput} from "./booking.input";


@ObjectType()
class BookingResponse extends PaginatedResponse(BookingEntity) {
}

@Resolver(() => BookingEntity)
export class BookingCRUDResolver extends BaseResolver
    <typeof BookingEntity, typeof BookingInput, typeof BookingResponse, BookingInput>

(
    {
        inputRef: BookingInput,
        classRef: BookingEntity,
        resultRef: BookingResponse,
        get: {
            set: ["total"],
            like: ["code", "pi", "info", "data"],
            filter: ["game", "user"],
        },
        upsert: {
            notEmpty: ["game", "user"],
        },
    },
)
{
    constructor()
    {
        super(new BookingService());
    }
}
