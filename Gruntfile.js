"use strict";

module.exports = function(grunt) {
    var src = "typeof",
        distributionDir = "dist",
        coverageDir = "cvg";

    var licenseMainLine
            = src + " <%= pkg.version %> Copyright (c) 2014 \"Richard KnG\" Richárd Szakács",
        licenseItselfLine
            = "Licensed under the MIT license.",
        licenseForDetailsLine
            = "see: <%= pkg.homepage %> for details";

    var bannerProductionNormal = "/*" + "\n"
        + " " +  licenseMainLine + "\n"
        + " " +  licenseItselfLine + "\n"
        + " " +  licenseForDetailsLine + "\n"
        + "*/",

        bannerProductionMinimized = "/* "
            + licenseMainLine + " | "
            + licenseItselfLine + " | "
            + licenseForDetailsLine
            + " */";

    var uglifyjs_src = {};
    uglifyjs_src["./" + src + ".min.js"] = ["src/" + src + ".js"];
    uglifyjs_src[distributionDir + "/" + src + ".min.js"] = ["src/" + src + ".js"];

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            src: ["src/" + src + ".js"]
        },
        clean: [
            "./" + src + ".js",
            "./" + src + ".min.js",
            distributionDir,
            coverageDir
        ],
        uglify: {
            dist: {
                files: uglifyjs_src
            }
        },
        copy: {
            to_dist: {
                src: "src/" + src + ".js",
                dest: distributionDir + "/" + src + ".js"
            },
            to_root: {
                src: "src/" + src + ".js",
                dest: "./" + src + ".js"
            }
        },
        usebanner: {
            normal: {
                options: {
                    position: 'top',
                    banner: bannerProductionNormal,
                    linebreak: true
                },
                files: {
                    src: [distributionDir + "/" + src + ".js", "./" + src + ".js"]
                }
            },
            minimized: {
                options: {
                    position: 'top',
                    banner: bannerProductionMinimized,
                    linebreak: true
                },
                files: {
                    src: [
                        "./" + src + ".min.js",
                        distributionDir + "/" + src + ".min.js"
                    ]
                }
            }
        },

        // Tests & coverage
        jasmine_node: {
            specNameMatcher: 'spec',
            projectRoot: 'test/spec/'
        },
        jasmine: {
            browserGlobal_src: {
                src: ["src/" + src + ".js"],
                options: {
                    specs: "test/spec/**/*.spec.js",
                    vendor: [
                        "node_modules/qulog/qulog.js"
                    ]
                }
            },
            browserAMD_src: {
                src: ["src/" + src + ".js"],
                options: {
                    specs: 'test/spec/**/*.spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            map: {
                                '*': {
                                    qulog: "node_modules/qulog/qulog",
                                    typeOf: "src/" + src + ".js"
                                }
                            }
                        }
                    }
                }
            },
            browserGlobal_min: {
                src: [distributionDir + "/" + src + ".js"],
                options: {
                    specs: "test/spec/**/*.spec.js",
                    vendor: [
                        "node_modules/qulog/qulog.js"
                    ]
                }
            },
            browserAMD_min: {
                src: [distributionDir + "/" + src + ".js"],
                options: {
                    specs: 'test/spec/**/*.spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            map: {
                                '*': {
                                    qulog: "node_modules/qulog/qulog",
                                    typeOf: distributionDir + "/" + src + ".min.js"
                                }
                            }
                        }
                    }
                }
            },
            coverage: {
                src: [distributionDir + "/" + src + ".js"],
                options: {
                    specs: 'test/spec/**/*.spec.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: coverageDir + '/coverage.json',
                        report: [
                            {   type: "html",
                                options: {
                                    dir: coverageDir
                                }
                            },
                            {   type: "lcov",
                                options: {
                                    dir: coverageDir
                                }
                            }
                        ],
                        thresholds: {
                            lines: 75,
                            statements: 75,
                            branches: 75,
                            functions: 90
                        }
                    },
                    vendor: [
                        "node_modules/qulog/qulog.js"
                    ]
                }
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: coverageDir + "/lcov.info",

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            }
        },

        // Documentation
        env: {
            doc: {
                JSDOC_GITHUBIFY_REMOTE: "<%= pkg.repository.url %>",
                JSDOC_GITHUBIFY_BRANCH: "master"
            }
        },
        jsdoc : {
            dist : {
                src: ["src/**/*.js"],
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');

    // For tests & coverage
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-coveralls');

    // Documentation
    grunt.loadNpmTasks('grunt-env');
    //grunt.loadNpmTasks('grunt-jsdoc');

    var task = {};
        task["build"] = {
            name: "build",
            list: ["jshint", "clean", "uglify", "copy", "usebanner"]
        };
        task["test"] = {
            name: "test",
            list: ["jshint", "jasmine_node",
                   "jasmine:browserGlobal_src",
                   "jasmine:browserAMD_src",
                   "jasmine:browserGlobal_min",
                   "jasmine:browserAMD_min"]
        };
        task["coverage"] = {
            name: "coverage",
            list: [].concat(
                task.build.list,
                ["jasmine:coverage", "coveralls"]
            )
        };
        task["ci"] = {
            name: "ci",
            list: [].concat(
                task.build.list,
                task.test.list,
                task.coverage.list
            )
        };
        task["doc"] = {
            name: "doc",
            list: ["env:doc", "jsdoc"]
        };
        task["default"] = {
            name: "default",
            list: []
        };

    grunt.registerTask(task.default.name, task.default.list);
    grunt.registerTask(task.build.name, task.build.list);
    grunt.registerTask(task.test.name, task.test.list);
    grunt.registerTask(task.coverage.name, task.coverage.list);
    grunt.registerTask(task.ci.name, task.ci.list);
};