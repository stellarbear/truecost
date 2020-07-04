import {TagEntity} from "./tag.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class TagService extends BaseService<TagEntity> {
    constructor() {
        super(DI.em.getRepository(TagEntity));
    }
}