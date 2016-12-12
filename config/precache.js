module.exports = {
	fonts: [
		'MetricWeb-Regular',
		'MetricWeb-Semibold',
		'MetricWeb-Bold',
		'FinancierDisplayWeb-Regular'
	]
		.map(font => `/__origami/service/build/v2/files/o-fonts-assets@1.3.0/${font}.woff?`),
	image: [
		'/__origami/service/image/v2/images/raw/fticon-v1:hamburger?source=o-icons&tint=%23505050,%23505050&format=svg',
		'/__origami/service/image/v2/images/raw/fticon-v1:cross?source=o-icons&tint=%23505050,%23505050&format=svg',
		'/__origami/service/image/v2/images/raw/ftlogo:brand-ft-masthead?source=o-header&tint=%23505050,%23505050&format=svg',
		'/__origami/service/image/v2/images/raw/ftlogo:brand-myft?source=o-header&tint=%23505050,%23505050&format=svg',
		'/__origami/service/image/v2/images/raw/fticon-v1:search?source=o-icons&tint=%23505050,%23505050&format=svg',
		'/__origami/service/image/v2/images/raw/fticon-v1:search?source=o-icons&tint=%23505050,%23505050&format=svg',
		'/__origami/service/image/v2/images/raw/ftlogo:brand-nikkei-tagline?source=o-footer&format=svg',
		'/__origami/service/image/v2/images/raw/ftlogo:brand-ft?source=next&tint=999999,999999'
	]
}
