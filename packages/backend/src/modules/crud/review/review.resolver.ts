import {ReviewEntity} from "./review.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {ReviewService} from "./review.service";
import {ReviewInput} from "./review.input";


@ObjectType()
class ReviewResponse extends PaginatedResponse(ReviewEntity) {
}

@Resolver(() => ReviewEntity)
export class ReviewCRUDResolver extends BaseResolver
    <typeof ReviewEntity, typeof ReviewInput, typeof ReviewResponse, ReviewInput>
    (
        {

            inputRef: ReviewInput,
            classRef: ReviewEntity,
            resultRef: ReviewResponse,
            get: {
                like: ["text", "who", "title"],
            },
            upsert: {
                notEmpty: ["text", "who", "title"],
            },
            restrictPublic: false,
        },
    )
{
    constructor() {
        super(new ReviewService());
    }
}
