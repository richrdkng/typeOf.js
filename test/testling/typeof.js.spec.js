var log = require("../../node_modules/qulog");
var JS = require("../../node_modules/jstest");
var Set = require("./set").Set;

JS.Test.describe('Set', function () {
    with(this) {
        before(function () {
            with(this) {
                this.set = new Set(['foo'])
            }
        });

        describe("Sanity checks", function () {
            with(this) {
                it('if "qulog" exists -> have to return "function"', function () {
                    with(this) {
                        assertEqual("function", typeof log);
                    }
                });
            }
        });

        describe('hasMember', function () {
            with(this) {
                it('returns true for members', function () {
                    with(this) {
                        assert(set.hasMember('foo'))
                    }
                });

                it('returns false for non-members', function () {
                    with(this) {
                        assertNot(set.hasMember('bar'))
                    }
                })
            }
        })
    }
});

JS.Test.autorun();