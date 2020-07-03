import {OptionEntity} from "./option.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../..";

export class OptionService extends BaseService<OptionEntity> {
    constructor() {
        super(DI.em.getRepository(OptionEntity));
    }
}