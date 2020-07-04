import {Query, Resolver} from "type-graphql";
import {GameEntity} from "../../crud/game/game.entity";
import {DI} from "../../../orm";

@Resolver(() => GameEntity)
export class GameResolver {
    gameRepo = DI.em.getRepository(GameEntity);

    @Query(() => [GameEntity])
    async GameGetAll() {
        const result = await this.gameRepo.findAll();

        return result;
    }
}
