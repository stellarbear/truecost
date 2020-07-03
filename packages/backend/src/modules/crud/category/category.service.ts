import {BaseService} from "../base/base.service";
import {DI} from "../../..";
import {CategoryEntity} from "./category.entity";

export class CategoryService extends BaseService<CategoryEntity> {
    constructor() {
        super(DI.em.getRepository(CategoryEntity));
    }
}