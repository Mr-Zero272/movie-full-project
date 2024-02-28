const { override, useBabelRc, addPostcssPlugins } = require('customize-cra');

module.exports = override(addPostcssPlugins([require('tailwindcss')]), useBabelRc());
