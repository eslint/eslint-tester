/**
 * @fileoverview Tests for ESLint Tester
 * @author Nicholas C. Zakas
 */
"use strict";

/*global describe, it*/

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rewire = require("rewire"),
    eslint = require("eslint").linter,
    ESLintTester = rewire("../../lib/eslint-tester"),
    path = require("path"),
    assert = require("chai").assert;

//------------------------------------------------------------------------------
// Rewire Mocha
//------------------------------------------------------------------------------

/*
 * So here's the situation. Because ESLintTester uses it() and describe() from
 * Mocha, any failures would show up in the output of this test file. That means
 * when we tested that a failure is thrown, that would also count as a failure
 * in the testing for ESLintTester. In order to remove those results from the
 * results of this file, we need to overwrite it() and describe() just in
 * ESLintTester to do nothing but run code. Effectively, it() and describe()
 * just become regular functions inside of index.js, not at all related to Mocha.
 * That allows the results of this file to be untainted and therefore accurate.
 */

ESLintTester.__set__("it", function(name, method) {
    method.apply(this, arguments);
});

ESLintTester.__set__("describe", function(name, method) {
    method.apply(this, arguments);
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("ESLintTester", function() {

    var eslintTester;

    beforeEach(function() {
        eslintTester = new ESLintTester(eslint);
    });

    it("should not throw an error when everything passes", function() {

        assert.doesNotThrow(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        });
    });

    it("should throw an error when valid code is invalid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have no errors but had 1/);
    });

    it("should throw an error when valid code is invalid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    { code: "eval(foo)" }
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have no errors but had 1/);
    });

    it("should throw an error if invalid code is valid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have 1 errors but had 0/);
    });

    it("should throw an error if invalid code is valid", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Should have 1 errors but had 0/);
    });

    it("should throw an error if invalid code specifies wrong type", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression2"}] }
                ]
            });
        }, /^Error type should be CallExpression2/);
    });

    it("should throw an error if invalid code specifies wrong line", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression", line: 5 }] }
                ]
            });
        }, /^Error line should be 5/);
    });

    it("should throw an error if invalid code has the wrong number of errors", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: [
                        { message: "eval sucks.", type: "CallExpression" },
                        { message: "eval sucks.", type: "CallExpression" }
                    ] }
                ]
            });
        }, /^Should have 2 errors but had 1/);
    });

    it("should throw an error if invalid code has the wrong explicit number of errors", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [
                    { code: "eval(foo)", errors: 2 }
                ]
            });
        }, /^Should have 2 errors but had 1/);
    });

    it("should throw an error if there are no valid tests", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                ],
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Each rule should have at least one valid test/);
    });

    it("should throw an error if there is no valid key", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                invalid: [
                    { code: "Eval(foo)", errors: [{ message: "eval sucks.", type: "CallExpression"}] }
                ]
            });
        }, /^Each rule should have at least one valid test/);
    });

    it("should throw an error if there are no invalid tests", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ],
                invalid: [

                ]
            });
        }, /^Each rule should have at least one invalid test/);
    });

    it("should throw an error if there is no invalid key", function() {

        assert.throws(function() {
            eslintTester.addRuleTest("tests/fixtures/no-eval", {
                valid: [
                    "Eval(foo)"
                ]
            });
        }, /^Each rule should have at least one invalid test/);
    });

});
