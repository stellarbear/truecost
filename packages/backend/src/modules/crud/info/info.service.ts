import {InfoEntity} from "./info.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../..";

export class InfoService extends BaseService<InfoEntity> {
    constructor() {
        super(DI.em.getRepository(InfoEntity));
    }
}