import {EntityManager, MikroORM} from "mikro-orm";
import {UserEntity} from "./modules/crud/user/user.entity";
import {entities} from './modules';
import {Dict} from "@truecost/shared";
import {BaseEntity} from "./modules/crud/base/base.entity";
import {OptionEntity} from "./modules/crud/option/option.entity";
import {TagEntity} from "./modules/crud/tag/tag.entity";
import {ItemEntity} from "./modules/crud/item/item.entity";

export const DI = {} as {
    orm: MikroORM;
    em: EntityManager;
    map: Dict<typeof BaseEntity>;
};

export const init = async () => {
    DI.orm = await MikroORM.init({
        discovery: {
            requireEntitiesArray: true,
        },
        entities,
        dbName: 'truecost',
        type: 'mongo',
        clientUrl: 'mongodb://mongo:27017',
        logger: console.log.bind(console),
        //debug: true
    });
    DI.em = DI.orm.em;

    DI.map = {
        "option": OptionEntity,
        "item": ItemEntity,
        "tag": TagEntity,
        "user": UserEntity,
    };
};
