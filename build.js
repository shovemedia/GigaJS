({
  dir:                     "build",
  appDir:                  "js/src",
  baseUrl:                 ".",
  mainConfigFile:          "js/lib/require.config.js",
  skipDirOptimize:         true,
  preserveLicenseComments: false,
  removeCombined:          true,
  keepBuildDir: true,

  optimize: 'none',

//  , exclude: ["jquery"]

  modules: [
    //  { name : "preloader/Main",  include: ["lib/almond"] },
    { name : "test/Site",         include: ["lib/almond"]        },
    { name : "lib/giga/Giga"     }
  ],
})
