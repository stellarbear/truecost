import {ReviewEntity} from "./review.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class ReviewService extends BaseService<ReviewEntity> {
    constructor() {
        super(DI.em.getRepository(ReviewEntity));
    }
}