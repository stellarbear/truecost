import {ItemEntity} from "./item.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class ItemService extends BaseService<ItemEntity> {
    constructor() {
        super(DI.em.getRepository(ItemEntity));
    }
}