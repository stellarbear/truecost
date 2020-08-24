import {MetaEntity} from "./meta.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class MetaService extends BaseService<MetaEntity> {
    constructor() {
        super(DI.em.getRepository(MetaEntity));
    }
}