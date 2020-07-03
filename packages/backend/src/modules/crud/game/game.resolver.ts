import {GameEntity} from "./game.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver} from "../base/base.resolver";
import {GameService} from "./game.service";
import {GameInput} from "./game.input";


@ObjectType()
class GameResponse extends PaginatedResponse(GameEntity) {
}

@Resolver(() => GameEntity)
export class GameCRUDResolver extends BaseResolver
    <typeof GameEntity, typeof GameInput, typeof GameResponse, GameInput>

(
    {
        inputRef: GameInput,
        classRef: GameEntity,
        resultRef: GameResponse,
        get: {
            set: ["active"],
            between: ["order"],
            like: ["name", "url"],
        },
        upsert: {
            notEmpty: ["active", "name", "url", "twitter", "background", "assistant"],
            unique: ["name", "url", "twitter"],
            images: ["background", "assistant"],
        },
        restrictPublic: false,
    },
)
{
    constructor()
    {
        super(new GameService());
    }
}
