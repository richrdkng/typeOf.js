"use strict";
module.exports = function(grunt) {
    var src = "es6.static.initializer";

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
        + "*/";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        traceur: {
            options: {
                experimental: true,
                blockBinding: true
            },
            custom: {
                files: [{
                    expand: true,
                    cwd: "./",
                    src: ["src/" + src + ".js", "test/" + src + ".test.js"],
                    dest: "test/spec"
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            src: ["src/" + src + ".js"]
        },
        clean: [
            "./" + src + ".js",
            "lib/" + src + ".js",
            "test/spec/"
        ],
        copy: {
            main: {
                src: "src/" + src + ".js",
                dest: "lib/" + src + ".js"
            },
            sub: {
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
                src: [ "lib/" + src + ".js", "./" + src + ".js" ]
              }
            }
        },

        // Tests
        jasmine_node: {
            options: {
                forceExit: false,
                specNameMatcher: 'spec'
            },
            projectRoot: 'test/'
        }
    });

    grunt.loadNpmTasks("grunt-traceur");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-banner");

    // For tests
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask("build", ["jshint", "clean", "copy", "usebanner", "traceur"]);
    grunt.registerTask("default", ["jasmine_node"]);
};