import {SubscriptionEntity} from "./subscription.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class SubscriptionService extends BaseService<SubscriptionEntity> {
    constructor() {
        super(DI.em.getRepository(SubscriptionEntity));
    }
}