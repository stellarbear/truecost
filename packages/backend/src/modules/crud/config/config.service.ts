import {ConfigEntity} from "./config.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class ConfigService extends BaseService<ConfigEntity> {
    constructor() {
        super(DI.em.getRepository(ConfigEntity));
    }
}