import {BookingEntity} from "./booking.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../../orm";

export class BookingService extends BaseService<BookingEntity> {
    constructor() {
        super(DI.em.getRepository(BookingEntity));
    }
}