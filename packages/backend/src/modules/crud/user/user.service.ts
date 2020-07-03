import {UserEntity} from "./user.entity";
import {BaseService} from "../base/base.service";
import {DI} from "../../..";

export class UserService extends BaseService<UserEntity> {
    constructor() {
        super(DI.em.getRepository(UserEntity));
    }
}