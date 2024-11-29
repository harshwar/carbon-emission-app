const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.blockList = [
    /node_modules\/\.bin\/.*/, // Ignore binaries
    /.*\/backend\/.*/         // Ignore backend files
];

module.exports = defaultConfig;
