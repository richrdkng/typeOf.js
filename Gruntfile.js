"use strict";

module.exports = function(grunt) {
    var src = "typeof",
        tempCompressDir = ".grunt/temp-compress",
        distributionDir = "dist",
        coverageDir = "cvrg";

    var licenseMainLine
            = src + " <%= pkg.version %> Copyright (c) 2014 \"Richard KnG\" (Richárd Szakács)",
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
        clean: {
            root: [
                "./" + src + ".js",
                "./" + src + ".min.js"
            ],
            dist: [
                distributionDir
            ],
            cvg: [
                coverageDir
            ],
            doc: [
                "doc/*",
                "!doc/logo/**",
                "!doc/template/**"
            ],
            compress: [
                tempCompressDir
            ]
        },
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
            },
            to_compress: {
                files: [
                    // Copy source files (.js and .min.js)
                    {   expand: true,
                        cwd: distributionDir + "/",
                        src: ["**"],
                        dest: tempCompressDir + "/"},
                    // Copy documentation and the logo
                    {   expand: true,
                        cwd: "doc/",
                        src: ["scripts/**", "styles/**", "logo/typeof.js_logo.png", "*.*"],
                        dest: tempCompressDir + "/doc/"}
                ]
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
                            statements: 100,
                            branches: 100,
                            functions: 100,
                            lines: 100
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
                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: true
            },
            main: {
                src: coverageDir + "/lcov.info"
            }
        },

        // Documentation
        jsdoc: {
            dist: {
                src: ["src/**/*.js"],
                options: {
                    destination: "doc",
                    template: "doc/template"
                }
            }
        },
        "gh-pages": {
            options: {
                base: "doc",
                branch: 'gh-pages',
                repo: 'https://Richard-KnG@github.com/richard-kng/typeof.js.git',
                //repo: 'https://Richard-KnG@github.com/richard-kng/typeof.js/tree/gh-pages',
                //repo: 'https://' + "fff731ec29ac3c4f6a73c0c35db332c7a5ccc505" + '@github.com/richard-kng/typeof.js.git'
                //repo: 'https://github.com/richard-kng/typeof.js.git?access_token=fff731ec29ac3c4f6a73c0c35db332c7a5ccc505'
                user: {
                    name: 'richard-kng',
                    email: 'richrdkng@gmail.com'
                }
            },
            src: [
                "*",
                "logo/*.png",
                "scripts/**",
                "styles/**"
            ]
        },

        // Distribution compress
        compress: {
            main: {
                options: {
                    level: 9,
                    mode: "zip",
                    archive: distributionDir + "/" + src + ".js.zip"
                },
                files: [
                    {   expand: true,
                        cwd: tempCompressDir + "/",
                        src: ["**"],
                        dest: "" }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Tests & coverage
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-coveralls');

    // Documentation
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-gh-pages');

    var task = {};
        task["build"] = {
            name: "build",
            list: ["jshint",
                   "clean",
                   "uglify",
                   "copy:to_dist",
                   "copy:to_root",
                   "usebanner"]
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
        task["pack"] = {
            name: "pack",
            // add build and doc generation too
            list: ["clean:compress",
                   "copy:to_compress",
                   "compress",
                   "clean:compress"]
        };
        task["doc"] = {
            name: "doc",
            list: ["clean:doc", "jsdoc"]
        };
        task["distribute"] = {
            name: "distribute",
            list: [].concat(
                task.build.list,
                task.test.list,
                task.doc.list,
                task.pack.list
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
        task["default"] = {
            name: "default",
            list: []
        };

    grunt.registerTask(task.default.name, task.default.list);

    grunt.registerTask(task.build.name, task.build.list);
    grunt.registerTask(task.test.name, task.test.list);
    grunt.registerTask(task.coverage.name, task.coverage.list);
    grunt.registerTask(task.ci.name, task.ci.list);

    grunt.registerTask(task.doc.name, task.doc.list);
    grunt.registerTask(task.pack.name, task.pack.list);
    grunt.registerTask(task.distribute.name, task.distribute.list);
};
