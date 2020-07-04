import {UserEntity} from "./user.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {UserService} from "./user.service";
import {UserInput} from "./user.input";


@ObjectType()
class UserResponse extends PaginatedResponse(UserEntity) {
}

@Resolver(() => UserEntity)
export class UserCRUDResolver extends BaseResolver
    <typeof UserEntity, typeof UserInput, typeof UserResponse, UserInput>

(
    {

        inputRef: UserInput,
        classRef: UserEntity,
        resultRef: UserResponse,
        get: {
            set: ["active"],
            like: ["name"],
        },
        upsert: {
            notEmpty: [],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new UserService());
    }
}
