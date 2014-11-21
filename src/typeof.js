/**
 * @file <b>Fix for "typeof" operator
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof">inconsistencies</a>
 * /<a href="http://javascript.crockford.com/remedial.html">problems</a> in JavaScript.<br/>
 * AMD/CommonJS/browser compatible.</b>
 * @author Richard KnG <richrdkng@gmail.com>
 * @version 1.0.0
 * @since 1.0.0
 * @copyright &copy; 2014 "Richard KnG" (Richárd Szakács). <b>Licensed under the MIT license</b>.
 */

(function(root, factory) {

    // Node.js/CommonJS and compatible
    /* istanbul ignore next */
    if(typeof module === 'object' && module.exports) {
        module.exports = factory();

    // AMD/RequireJS and compatible
    /* istanbul ignore next */
    } else if(typeof define === 'function' && define.amd) {
        define(factory);

    // Browser directly
    } else {
        root.typeOf = factory();
    }
}(this, function() {
    "use strict";

    // Function.prototype.bind polyfill
    // issue: https://code.google.com/p/phantomjs/issues/detail?id=522
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    /* istanbul ignore next */
    if(!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }

    // Protect fundamental functionality via store them privately
    var Function_prototype = Function.prototype,
        bind = Function_prototype.bind.bind(Function_prototype.call),
        Object_prototype_toString = bind(Object.prototype.toString);

    /**
     * @description Returns the proper type of the object
     *
     * @name typeOf
     * @function
     * @param {*} object - An object of any type
     * @returns {string}
     *
     * @example
     * // primitive types (undefined, null, Boolean, Number, String)
     * typeOf() === "undefined";
     * typeOf(undefined) === "undefined";
     * typeOf(null) === "null";
     * typeOf(true) === "boolean";
     * typeOf(false) === "boolean";
     * typeOf(-1) === "number";
     * typeOf(0) === "number";
     * typeOf(1) === "number";
     * typeOf(-Infinity) === "number";
     * typeOf(Infinity) === "number";
     * typeOf(NaN) === "number";
     * typeOf("string") === "string";
     *
     * // cast as primitive types
     * typeOf(Boolean(true)) === "boolean";
     * typeOf(Number(42)) === "number";
     * typeOf(String("a string")) === "string";
     *
     * // reference types
     * typeOf([]) === "array";
     * typeOf({}) === "object";
     * typeOf(function(){}) === "function";
     * typeOf(new Date()) === "object";
     * typeOf(new RegExp()) === "object";
     * typeOf(/s+/g) === "object"; // an inline RegExp
     * typeOf(new Error()) === "object";
     *
     * // primitive wrapper objects (Boolean, Number, String)
     * typeOf(new Boolean(true)) === "object";
     * typeOf(new Number(42)) === "object";
     * typeOf(new String("a string")) === "object";
     *
     * @example
     * function isObject(object) {
     *     if(typeOf(object) === "object") {
     *         return true;
     *     }
     *     return false;
     * }
     *
     * @example
     * function isArray(object) {
     *     return typeOf(object) === "array";
     * }
     *
     * @example
     * // ...
     * if(typeOf(value) === "object") {
     *     // ...
     * } else if(typeOf(value) === "string") {
     *     // ...
     * }
     * // ...
     *
     * @example
     * switch(typeOf(object)) {
     *     case "number":
     *         // ...
     *         break;
     *     case "string":
     *         // ...
     *         break;
     *     // Intentional fallthrough
     *     case "object":
     *     case "array":
     *         // ...
     *         break;
     *     default:
     *         break;
     * }
     */
    return function(object) {
        if(typeof object === "object") {
            if(object) {
                if(Object_prototype_toString(object) === "[object Array]") {
                    return "array";
                }
                return "object";
            }
            return "null";
        }
        return typeof object;
    };
}));