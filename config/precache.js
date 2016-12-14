const appcache = {
	fonts: [
		'https://www.ft.com/__origami/service/build/v2/files/o-fonts-assets@1.3.0/MetricWeb-Regular.woff?',
		'https://www.ft.com/__origami/service/build/v2/files/o-fonts-assets@1.3.0/MetricWeb-Semibold.woff?',
		'https://www.ft.com/__origami/service/build/v2/files/o-fonts-assets@1.3.0/FinancierDisplayWeb-Regular.woff?'
	],
	image: [
		'https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:hamburger?source=o-icons&tint=%23505050,%23505050&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:search?source=o-icons&tint=%23505050,%23505050&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo:brand-ft-masthead?source=o-header&tint=%23505050,%23505050&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo:brand-myft?source=o-header&tint=%23505050,%23505050&format=svg'
	]
}

const sw = {
	fonts: appcache.fonts.concat([
		'https://www.ft.com/__origami/service/build/v2/files/o-fonts-assets@1.3.0/MetricWeb-Bold.woff?',
	]),
	image: appcache.image.concat([
		'https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:cross?source=o-icons&tint=%23505050,%23505050&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo:brand-nikkei-tagline?source=o-footer&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo:brand-ft?source=next&tint=999999,999999',
		'https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:refresh?source=o-icons&tint=%23FFFFFF,%23FFFFFF&format=svg'
	])
}

module.exports = { appcache, sw }
