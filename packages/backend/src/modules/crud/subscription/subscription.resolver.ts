import {SubscriptionEntity} from "./subscription.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {SubscriptionService} from "./subscription.service";
import {SubscriptionInput} from "./subscription.input";


@ObjectType()
class SubscriptionResponse extends PaginatedResponse(SubscriptionEntity) {
}


@Resolver(() => SubscriptionEntity)
export class SubscriptionCRUDResolver extends BaseResolver
    <typeof SubscriptionEntity, typeof SubscriptionInput, typeof SubscriptionResponse, SubscriptionInput>

(
    {

        inputRef: SubscriptionInput,
        classRef: SubscriptionEntity,
        resultRef: SubscriptionResponse,
        get: {
            set: [],
            like: ["description"],
            between: ["days", "discount", "price"],
        },
        upsert: {
            notEmpty: ["days", "price", "discount", "description"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new SubscriptionService());
    }
}
