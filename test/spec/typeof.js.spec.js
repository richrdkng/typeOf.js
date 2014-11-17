(function (root, factory) {

    // Node.js/CommonJS and compatible
    if(typeof module === "object" && module.exports) {
        factory(require("../../node_modules/qulog"),
                require("../../typeof.js"),
                require("../../typeof.min.js"));

    // AMD/RequireJS and compatible
    } else if(typeof define === "function" && define.amd) {
        define(["qulog",
                "typeOf"], factory);

    // Browser directly
    } else {
        factory(root.qulog, root.typeOf);
    }
}(this, function factory(log, typeOf, typeOf_min) {

    var hasMinimized = typeof typeOf_min !== "undefined";

    // Sanity checks, whether the dependencies (jQuery and qulog and the plugin) are loaded properly
    describe("Sanity checks", function() {
        it('if "qulog" exists -> have to return "function"', function() {
            expect(typeof log).toEqual("function");
        });

        it('if "typeOf" loaded -> have to return "function"', function() {
            expect(typeof typeOf).toEqual("function");
            if(hasMinimized) {
                expect(typeof typeOf_min).toEqual("function");
            }
        });
    });

    // Real test start from here
    describe('Tests', function () {

        it('check for typeOf() -> have to return "undefined"', function () {
            expect(typeOf()).toEqual("undefined");
            if(hasMinimized) {
                expect(typeOf_min()).toEqual("undefined");
            }
        });

        it('check for typeOf(undefined) -> have to return "undefined"', function () {
            expect(typeOf(undefined)).toEqual("undefined");
            if(hasMinimized) {
                expect(typeOf_min(undefined)).toEqual("undefined");
            }
        });

        it('check for typeOf(null) -> have to return "null"', function () {
            expect(typeOf(null)).toEqual("null");
            if(hasMinimized) {
                expect(typeOf_min(null)).toEqual("null");
            }
        });

        it('check for typeOf(true|false) -> have to return "boolean"', function () {
            expect(typeOf(true)).toEqual("boolean");
            expect(typeOf(false)).toEqual("boolean");
            if(hasMinimized) {
                expect(typeOf_min(true)).toEqual("boolean");
                expect(typeOf_min(false)).toEqual("boolean");
            }
        });

        it('check for typeOf(-1|0|1) -> have to return "number"', function () {
            expect(typeOf(-1)).toEqual("number");
            expect(typeOf(0)).toEqual("number");
            expect(typeOf(1)).toEqual("number");
            if(hasMinimized) {
                expect(typeOf_min(-1)).toEqual("number");
                expect(typeOf_min(0)).toEqual("number");
                expect(typeOf_min(1)).toEqual("number");
            }
        });

        it('check for typeOf(-Infinity|Infinity) -> have to return "number"', function () {
            expect(typeOf(-Infinity)).toEqual("number");
            expect(typeOf(Infinity)).toEqual("number");
            if(hasMinimized) {
                expect(typeOf_min(-Infinity)).toEqual("number");
                expect(typeOf_min(Infinity)).toEqual("number");
            }
        });


        it('check for typeOf(NaN) -> have to return "number"', function () {
            expect(typeOf(NaN)).toEqual("number");
            if(hasMinimized) {
                expect(typeOf_min(NaN)).toEqual("number");
            }
        });

        it('check for typeOf("string") -> have to return "string"', function () {
            expect(typeOf("string")).toEqual("string");
            if(hasMinimized) {
                expect(typeOf_min("string")).toEqual("string");
            }
        });


        it('check for typeOf([]) -> have to return "array"', function () {
            expect(typeOf([])).toEqual("array");
            if(hasMinimized) {
                expect(typeOf_min([])).toEqual("array");
            }
        });

        it('check for typeOf({}) -> have to return "object"', function () {
            expect(typeOf({})).toEqual("object");
            if(hasMinimized) {
                expect(typeOf_min({})).toEqual("object");
            }
        });

        it('check for typeOf(function(){}) -> have to return "function"', function () {
            expect(typeOf(function(){})).toEqual("function");
            if(hasMinimized) {
                expect(typeOf_min(function(){})).toEqual("function");
            }
        });

        it('check for typeOf(Boolean()|Number()|String()) -> have to return "boolean"', function () {
            expect(typeOf(Boolean(true))).toEqual("boolean");
            expect(typeOf(Boolean(false))).toEqual("boolean");

            expect(typeOf(Number(-1))).toEqual("number");
            expect(typeOf(Number(0))).toEqual("number");
            expect(typeOf(Number(1))).toEqual("number");
            expect(typeOf(Number(-Infinity))).toEqual("number");
            expect(typeOf(Number(Infinity))).toEqual("number");
            expect(typeOf(Number(NaN))).toEqual("number");

            expect(typeOf(String())).toEqual("string");
            expect(typeOf(String(0))).toEqual("string");
            expect(typeOf(String(""))).toEqual("string");

            if(hasMinimized) {
                expect(typeOf_min(Boolean(true))).toEqual("boolean");
                expect(typeOf_min(Boolean(false))).toEqual("boolean");

                expect(typeOf_min(Number(-1))).toEqual("number");
                expect(typeOf_min(Number(0))).toEqual("number");
                expect(typeOf_min(Number(1))).toEqual("number");
                expect(typeOf_min(Number(-Infinity))).toEqual("number");
                expect(typeOf_min(Number(Infinity))).toEqual("number");
                expect(typeOf_min(Number(NaN))).toEqual("number");

                expect(typeOf_min(String())).toEqual("string");
                expect(typeOf_min(String(0))).toEqual("string");
                expect(typeOf_min(String(""))).toEqual("string");
            }
        });

        it('check for typeOf(new Date()) -> have to return "object"', function () {
            expect(typeOf(new Date())).toEqual("object");
            if(hasMinimized) {
                expect(typeOf_min(new Date())).toEqual("object");
            }
        });

        it('check for typeOf(new Regex()) -> have to return "object"', function () {
            expect(typeOf(/\s/gi)).toEqual("object");
            if(hasMinimized) {
                expect(typeOf_min(/\s/gi)).toEqual("object");
            }
        });

        it('check for typeOf(new Error()) -> have to return "object"', function () {
            expect(typeOf(new Error())).toEqual("object");
            if(hasMinimized) {
                expect(typeOf_min(new Error())).toEqual("object");
            }
        });
    });
}));