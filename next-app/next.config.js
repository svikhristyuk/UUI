/** @type {import('next').NextConfig} */
const path = require('path')
const withSass = require('@zeit/next-sass');

module.exports = withSass({
    /* bydefault config  option Read For More Optios
    here https://github.com/vercel/next-plugins/tree/master/packages/next-sass*/
    cssModules: true
})

module.exports = {
        webpack: (config) => {
            config.module.rules.push({
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            });
            return config;
        },
        sassOptions: {
            includePaths: [path.join(__dirname, 'styles')],
        },
        reactStrictMode: false,
        images: {
            domains: ['rickandmortyapi.com']
        },
        devIndicators: {
            buildActivity: false
        }
    };
