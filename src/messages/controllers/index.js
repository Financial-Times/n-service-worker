
import { router } from '../routing';
import clientIdLookupController from './client-id-lookup';

router.command('getClientId', clientIdLookupController);
