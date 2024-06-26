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
            set: ["total", "currency"],
            like: ["code", "pi", "info", "data", "subscription"],
            filter: ["user"],
        },
        upsert: {
            notEmpty: ["user", "code", "currency"],
            images: ["images"],
        },
    },
)
{
    constructor()
    {
        super(new BookingService());
    }
}
