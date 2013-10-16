({
  dir:                     "build",
  appDir:                  "src/js",
  baseUrl:                 ".",
  mainConfigFile:          "src/js/lib/require.config.js",
  skipDirOptimize:         true,
  preserveLicenseComments: false,
  removeCombined:          true,
  keepBuildDir: true,

  optimize: 'none',

  modules: [
    { name : "test/Site",     include: ["lib/almond"], exclude: ["jquery"] },
    { name : "lib/giga/Giga",                          exclude: ["jquery"] }
  ],
})
