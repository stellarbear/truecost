
import {init as ormInit, DI} from './../orm';

(async () => {
    await ormInit();
  
    const migrator = DI.orm.getMigrator();
    await migrator.createMigration(); 
    await migrator.up(); 
    
    await DI.orm.close(true);
  })();