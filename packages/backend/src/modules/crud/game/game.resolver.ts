import {GameEntity} from "./game.entity";
import {PaginatedResponse} from "../../../helpers/pagination";
import {ObjectType, Resolver} from "type-graphql";
import {BaseResolver, MetaResolver} from "../base/base.resolver";
import {GameService} from "./game.service";
import {GameInput} from "./game.input";


@ObjectType()
class GameResponse extends PaginatedResponse(GameEntity) {
}

@Resolver(() => GameEntity)
export class GameCRUDResolver extends MetaResolver
    <typeof GameEntity, typeof GameInput, typeof GameResponse, GameInput>

(
    {
        inputRef: GameInput,
        classRef: GameEntity,
        resultRef: GameResponse,
        get: {},
        upsert: {
            notEmpty: ["twitter", "background", "assistant"],
            unique: ["twitter"],
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
