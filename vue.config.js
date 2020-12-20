const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const i18n = require(path.join(__dirname, 'src/common/i18n/i18n.json'));

module.exports = {
    configureWebpack: {
        plugins: [
            // new PrerenderSPAPlugin({
            //     staticDir: path.join(__dirname, 'dist'),
            //     routes: _getRoutes(),
            //     renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
            //         renderAfterDocumentEvent: 'rendered',
            //     }),
            //     postProcessHtml: function(context) {
            //         const locale = context.route.replace('/', '');
            //         const localeCode = locale === 'ko' ? 'KR' : 'US';
            //         let html = context.html;
            //
            //         html = html.replace(
            //             /<meta name="description" content="[^<]*">/i,
            //             `<meta name="description" content="${i18n[locale].metadata.description}" />`
            //         );
            //
            //         html = html.replace(
            //             /<meta property="og:description" content="[^<]*">/i,
            //             `<meta property="og:description" content="${i18n[locale].metadata.description}" />`
            //         );
            //
            //         html = html.replace(
            //             /<meta name="keywords" content="[^<]*">/i,
            //             `<meta name="keywords" content="${i18n[locale].metadata.keywords}" />`
            //         );
            //
            //         html = html.replace(
            //             /<meta name="twitter:description" content="[^<]*">/i,
            //             `<meta name="twitter:description" content="${i18n[locale].metadata.description}" />`
            //         );
            //
            //         html = html.replace(
            //             /<meta property="og:locale" content="[^<]*">/i,
            //             `<meta property="og:locale" content="${locale}" />`
            //         );
            //
            //         html = html.replace(
            //             /<meta property="og:locale" content="[^<]*">/i,
            //             `<meta property="og:locale" content="${locale}_${localeCode}" />`
            //         );
            //
            //         return html;
            //     }
            // }),
        ]
    },
};

function _getRoutes() {
    return Object.keys(require(path.join(__dirname, 'src/common/i18n/i18n.json')))
                 .map(lang => `/${lang}`);
}
