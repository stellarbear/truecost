import {DI, init as ormInit} from './../orm';

(async () => {
    await ormInit();

    const migrator = DI.orm.getMigrator();
    await migrator.createMigration();
    await migrator.up();

    await DI.orm.close(true);
})();
