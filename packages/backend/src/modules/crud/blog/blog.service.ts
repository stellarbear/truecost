import {BlogEntity} from "./blog.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class BlogService extends BaseService<BlogEntity> {
    constructor() {
        super(DI.em.getRepository(BlogEntity));
    }
}