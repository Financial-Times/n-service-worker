import router from '../utils/router';
import { registerCache } from '../utils/personal';
import precache from '../utils/precache';

function getCacheOptions (days, isPersonal) {
	return {
		name: 'ads' + (isPersonal ? ':personal' : '') + '-v1',
		maxAge: 60 * 60 * (days >= 1 ? days * 24 : 1),
		maxEntries: 60
	};
}

export const popularConcepts = [
	'd8009323-f898-3207-b543-eab4427b7a77', // old id: MQ==-U2VjdGlvbnM=
	'45391af4-d00f-3cf5-813f-aff2e85a7991', // old id: MTA3-U2VjdGlvbnM=
	'674fafbb-871b-3874-a413-a42e2ca02fce', // old id: MjI=-U2VjdGlvbnM=
	'eae81e92-5092-350c-8dbf-741d54be79a5', // old id: MzA=-U2VjdGlvbnM=
	'8d5d7bae-a5df-33f0-9acf-cc57badf805b', // old id: NTA=-U2VjdGlvbnM=
	'fd12214a-9f96-3375-9b44-3cf2f2f753bc', // old id: MTE=-U2VjdGlvbnM=
	'b2997bc8-d54f-3c4b-870f-130a4b337a51', // old id: TnN0ZWluX0dMX0NO-R0w=
	'3cd493ab-5648-3166-addc-69e9591c9843', // old id: OQ==-U2VjdGlvbnM=
	'99352f45-32b3-3059-b3e6-1acc1502624f', // old id: Mg==-U2VjdGlvbnM=
	'0c7b5242-2d94-3d6d-973c-af455bb85ff1', // old id: MjM=-U2VjdGlvbnM=
	'71a5efa5-e6e0-3ce1-9190-a7eac8bef325', // old id: NTc=-U2VjdGlvbnM=
	'98815f9a-0c35-3824-98fb-f134965f56b7', // old id: Ng==-U2VjdGlvbnM=
	'972618ae-9c0b-3479-aab5-8fe867c44561', // old id: NDU=-U2VjdGlvbnM=
	'2dd66dcb-b87d-35ef-b1bf-ce8706f2c382', // old id: NTM=-U2VjdGlvbnM=
	'1ddb5be2-a098-38e0-b510-e37bf4f494b1', // old id: NTU=-U2VjdGlvbnM=
	'36d923a7-e1d8-3f08-a41c-73aae7fe97d9', // old id: NDE=-U2VjdGlvbnM=
	'd969d76e-f8f4-34ae-bc38-95cfd0884740', // old id: NzE=-U2VjdGlvbnM=
	'b49b8b7b-d334-308e-9e13-0e7dd8ada028', // old id: MTY=-U2VjdGlvbnM=
	'dd933b7f-e90b-3179-89d9-139b5f071678', // old id: MTA0-U2VjdGlvbnM=
	'49f42d9a-aafd-3b79-86f2-05b64675cf65', // old id: OTM=-U2VjdGlvbnM=
	'852939c8-859c-361e-8514-f82f6c041580', // old id: Mjk=-U2VjdGlvbnM=
	'87e13362-4a6e-39c4-ba4a-f2745b2326ee', // old id: MzQ=-U2VjdGlvbnM=
	'eec4d085-41e0-3f98-a9b2-c487f8bde527', // old id: NTY=-U2VjdGlvbnM=
	'38dbd827-fedc-3ebe-919f-e64cf55ea959', // old id: MTE2-U2VjdGlvbnM=
	'57e1b228-0346-32aa-811d-385628558b1c', // old id: MTE4-U2VjdGlvbnM=
	'c94065ab-b78b-37b3-a502-b0c415375e89', // old id: MTE3-U2VjdGlvbnM=
	'19e0e2af-78c6-3e3d-942b-e4fbe27516dd', // old id: MTAz-U2VjdGlvbnM=
	'755d0598-88d9-34c2-9733-d7995744d23a', // old id: MTA1-U2VjdGlvbnM=
	'f814d8f7-d38e-31b8-a51f-3882805288fd', // old id: MTI1-U2VjdGlvbnM=
	'5b234da3-5767-3bef-b3e8-0845df9fcfc5', // old id: MTI2-U2VjdGlvbnM=
	'e17ebcde-ef25-38a1-966e-b2643e9d655f', // old id: MTI3-U2VjdGlvbnM=
	'4efb3975-e567-35e4-ba70-86cfe3dcbc8a', // old id: MTIz-U2VjdGlvbnM=
	'f294c389-8e8c-3e92-9ccf-ea1ce61b1bcd', // old id: MTM1-U2VjdGlvbnM=
	'c0f18dc8-9917-382b-9e4c-3286f5cab3ba', // old id: ZjU2ZGIyNDMtNWYwOS00YzcwLWJmN2MtYjE1OGNiN2Y1OTVl-U2VjdGlvbnM=
	'9ff18ddd-2a36-30ad-a96c-1ad84fcadaba', // old id: NzI=-U2VjdGlvbnM=
	'b639555c-694d-38f7-9edf-8bb5fa74084f', // old id: OTg=-U2VjdGlvbnM=
	'1cda05e1-128c-393a-9517-1dafedeb049f', // old id: MTA2-U2VjdGlvbnM=
	'404d2b04-cb42-376b-8729-b6f254a76187', // old id: MTU5-U2VjdGlvbnM=
	'12992ec3-69e3-31d9-bb2a-f4d58bfbd158', // old id: MTU4-U2VjdGlvbnM=
	'676fa5a9-7d01-332b-b308-7c4ddb3a92e0', // old id: MTM4-U2VjdGlvbnM=
	'20f53e5b-3de9-34e4-9202-d019473b9b36', // old id: MTU3-U2VjdGlvbnM=
	'2d3e16e0-61cb-4322-8aff-3b01c59f4daa', // old id: YzhlNzZkYTctMDJiNy00NTViLTk3NmYtNmJjYTE5NDEyM2Yw-QnJhbmRz
	'0dd94bc1-6873-44d5-9ca4-7d4be69acb3c', // old id: MDRkMzU4YjktMjA0OS00MWEzLWJiY2ItYmJkZWNhMmVmMzQ0-QnJhbmRz
	'9172fe96-07eb-3905-897f-9efcf11329d7', // old id: MTY1-U2VjdGlvbnM=
	'c92d1ce0-0621-3465-ba94-80761f4c2ba2', // old id: MTUz-U2VjdGlvbnM=
	'02afce67-6a86-3e49-8425-5f026b0d9be4', // old id: MTQ5-U2VjdGlvbnM=
	'df5190e2-20f9-379b-9054-06ecfbdcb3a0', // old id: OTYxNmI3YWMtY2M1OS00N2RkLWJlNWEtOGZjOGQ3ODE5YmQx-U2VjdGlvbnM=
	'6d824b3d-209e-340b-a79e-3e0038ff2776', // old id: MWJkMTFlYmUtNmRjMy00MDE5LWI0MGItYjM1MjRkOGFmODhk-U2VjdGlvbnM=
	'f967910f-67d5-31f7-a031-64f8af0d9cf1', // old id: MTQ4-U2VjdGlvbnM=
	'3e0674b7-ea87-369a-b536-ead47dd076ae', // old id: MTQz-U2VjdGlvbnM=
	'c218b451-c4fb-398f-b89b-9bfbd60bd61a', // old id: MTQy-U2VjdGlvbnM=
	'78397642-0885-378a-b411-001978b1f3b9', // old id: MTU2-U2VjdGlvbnM=
	'40433e6c-d2ac-3994-b168-d33b89b284c7', // old id: NTQ=-U2VjdGlvbnM=
	'0a757042-e321-304f-97c0-e04337bc698e', // old id: MTQ0-U2VjdGlvbnM=
	'59fd6642-055c-30b0-b2b8-8120bc2990af', // old id: MTQw-U2VjdGlvbnM=
	'7def5f07-89d0-37b9-bd1c-f56a8dd83bcf', // old id: MTUy-U2VjdGlvbnM=
	'5c7592a8-1f0c-11e4-b0cb-b2227cce2b54', // old id: NTlhNzEyMzMtZjBjZi00Y2U1LTg0ODUtZWVjNmEyYmU1NzQ2-QnJhbmRz
	'70f66462-e313-3e83-ad39-d7724973d276', // old id: MTQ2-U2VjdGlvbnM=
	'ac8b3a4c-72a9-332c-83b0-da4adea9dda5' 	// old id: MTQ1-U2VjdGlvbnM=
];

// Top menu items, to be pre-loaded
export const topSections = [
	'd8009323-f898-3207-b543-eab4427b7a77',	// world
	'852939c8-859c-361e-8514-f82f6c041580',	// companies
	'd969d76e-f8f4-34ae-bc38-95cfd0884740', // markets
	'38dbd827-fedc-3ebe-919f-e64cf55ea959', // opinion
	'f814d8f7-d38e-31b8-a51f-3882805288fd', // work & careers
	'f967910f-67d5-31f7-a031-64f8af0d9cf1', // life and arts
	'59fd6642-055c-30b0-b2b8-8120bc2990af', // personal finance
	'40433e6c-d2ac-3994-b168-d33b89b284c7', // science
	'5c7592a8-1f0c-11e4-b0cb-b2227cce2b54' 	// fastft
];

export default function init (cacheHandler) {
	registerCache('next:ads:personal-v1');

	// Precache top level topSections
	// Adblockers block ads-api requests
	// net::ERR_BLOCKED_BY_CLIENT cannot be differentiated
	// so we just fail silently by passing isOptional: true
	const precacheCacheOptions = getCacheOptions(7);
	precache(
		precacheCacheOptions.name,
		topSections.map(section => `https://ads-api.ft.com/v1/concept/${section}`),
		{ maxAge: precacheCacheOptions.maxAge, maxEntries: precacheCacheOptions.maxEntries },
		{ isOptional: true }
	);

	// Set up caching for ads-api and third party ads scripts

	// Personalised stuff
	router.get('/v1/user', cacheHandler, {
		origin: 'https://ads-api.ft.com',
		cache: getCacheOptions(7, true)
	});

	router.get('/userdata/*', cacheHandler, {
		origin: 'https://cdn.krxd.net',
		cache: getCacheOptions(1, true)
	});


	router.get(new RegExp('\/v1\/concept\/(' + popularConcepts.join('|') + ')'), cacheHandler, {
		origin: 'https://ads-api.ft.com',
		cache: getCacheOptions(1)
	});

	router.get('/tag/js/gpt.js', cacheHandler, {
		origin: 'https://www.googletagservices.com',
		cache: getCacheOptions(7)
	});

	router.get('/gpt/pubads_impl_*.js', cacheHandler, {
		origin: 'https://securepubads.g.doubleclick.net',
		cache: getCacheOptions(7)	// was 30
	});

	router.get('/pagead/osd.js', cacheHandler, {
		origin: 'https://pagead2.googlesyndication.com',
		cache: getCacheOptions(1)
	});


	router.get('/safeframe/*/html/container.html', cacheHandler, {
		origin: 'https://tpc.googlesyndication.com',
		cache: getCacheOptions(0)
	});

	router.get('/controltag*', cacheHandler, {
		origin: 'https://cdn.krxd.net',
		cache: getCacheOptions(7)
	});

	router.get('/ctjs/controltag.js*', cacheHandler, {
		origin: 'https://cdn.krxd.net',
		cache: getCacheOptions(7)		// was 30
	});
}
