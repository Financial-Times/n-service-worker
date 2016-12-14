
import { router } from '../routing';
import clientIdLookupController from './client-id-lookup';
import cacheMetaLookup from './cache-meta-lookup';

router.command('getClientId', clientIdLookupController);
router.command('getCacheMeta', cacheMetaLookup);
