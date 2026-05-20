const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Plugin que elimina la propiedad enableBundleCompression
 * que no es compatible con react-native 0.76
 */
const withAndroidGradle = (config) => {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /\s*enableBundleCompression\s*=\s*\(findProperty\('android\.enableBundleCompression'\)\s*\?:\s*false\)\.toBoolean\(\)\n?/,
      '\n'
    );
    return config;
  });
};

module.exports = withAndroidGradle;