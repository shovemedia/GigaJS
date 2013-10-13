({
  dir:                     "build",
  appDir:                  "src/js",
  baseUrl:                 ".",
  mainConfigFile:          "src/js/libs/require.config.js",
  skipDirOptimize:         true,
  preserveLicenseComments: false,
  removeCombined:          true,
keepBuildDir: true, 

  optimize: 'none',

  modules: [
    { name : "giga",	   include: ["libs/almond"], exclude: ["jquery"] }
  ],
})
