/*
 typeof 1.0.2 Copyright (c) 2014 "Richard KnG" Richárd Szakács
 Licensed under the MIT license.
 see: https://github.com/richard-kng/typeof.js for details
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

    /**
     * Returns the proper type of passed value
     * @name typeOf
     * @param {} value - One value of any type
     * @returns {string}
     */
    function typeOf(value) {
        if(typeof value === "object") {
            if(value) {
                if(Object.prototype.toString.call(value) === "[object Array]") {
                    return "array";
                }
                return "object";
            }
            return "null";
        }
        return typeof value;
    }
    return typeOf;
}));