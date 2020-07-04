import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";
import {GameEntity} from "./game.entity";

export class GameService extends BaseService<GameEntity> {
    constructor() {
        super(DI.em.getRepository(GameEntity));
    }
}