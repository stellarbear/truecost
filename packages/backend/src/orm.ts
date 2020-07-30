import {EntityManager, EntityRepository, MikroORM} from "mikro-orm";
import {UserEntity} from "./modules/crud/user/user.entity";
import {entities} from './modules';

export const DI = {} as {
    orm: MikroORM;
    em: EntityManager;
    userRepo: EntityRepository<UserEntity>;
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
    DI.userRepo = await DI.em.getRepository(UserEntity);
};
