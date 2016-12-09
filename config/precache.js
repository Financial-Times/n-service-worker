module.exports = {
	fonts: [
		'MetricWeb-Regular',
		'MetricWeb-Semibold',
		'FinancierDisplayWeb-Regular'
	]
		.map(font => `https://www.ft.com/__origami/service/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`),
	image: [
		'https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:hamburger?source=o-icons&tint=%23505050,%23505050&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo:brand-ft-masthead?source=o-header&tint=%23505050,%23505050&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/ftlogo:brand-myft?source=o-header&tint=%23505050,%23505050&format=svg',
		'https://www.ft.com/__origami/service/image/v2/images/raw/fticon-v1:search?source=o-icons&tint=%23505050,%23505050&format=svg'
	]
}
