  






var chai = require("chai")
var should = chai.should()
var assert = chai.assert
var expect = chai.expect

var parseArgs = require("./index");

function callback () {}


describe("Arguments parser", () => { 
    it("should validate parseString expression with unequal number of braces", () => {

        function testFn () {
            parseArgs.bind({}, arguments, 'name, [').should.throw("Invalid Pattern")
        }
        testFn()
    })
    it("should assign values to first level arguments", () => {
        function testFn() {
            let [name, email, age] = parseArgs(arguments, "name, email, age")

            name.should.be.eql("John")
            email.should.be.eql("john@mail.com")
            age.should.be.eql(24)
         }

         testFn("John", "john@mail.com", 24)
    })
    it("should ignore spaces in parse string", () => {
        function testFn() {
            let [name, email, age] = parseArgs(arguments, "name        ,email, age")

            name.should.be.eql("John")
            email.should.be.eql("john@mail.com")
            age.should.be.eql(24)
         }

         testFn("John", "john@mail.com", 24)
    })
    it("should assign null/undefined if default values are not specified", () => {
        function testFn() {
            let [name, email, age] = parseArgs(arguments, "name, email, age")

            name.should.be.eql("John")
            email.should.be.eql("john@mail.com")
            should.not.exist(age)
         }

         testFn("John", "john@mail.com")
    })
    it("should assign default values if available", () => {
        function testFn() {
            let [name, email, age] = parseArgs(arguments, "name, email, age", {
                args: ['vin', 'diesel@mail.com', 34]
            })

            name.should.be.eql("John")
            email.should.be.eql("john@mail.com")
            age.should.be.eql(34)
         }

         testFn("John", "john@mail.com")
    })
    it("should assign values to second level arguments if all the first level variables are satisfied", () => {
        function testFn() {
            let [name, email, age] = parseArgs(arguments, "name [, email], age", {
                args: ['vin', 'diesel@mail.com', 34]
            })

            name.should.be.eql("John")
            email.should.be.eql("diesel@mail.com")
            age.should.be.eql(28)
         }

         testFn("John", 28)
    })
    it("should assign values to third level arguments after second level", () => {
        function testFn() {
            let [name, email, age, gender] = parseArgs(arguments, "name [, email [, age]], gender", {
                args: ['vin', 'diesel@mail.com', 34, "female"]
            })

            name.should.be.eql("John")
            email.should.be.eql("john@mail.com")
            age.should.be.eql(34)
            gender.should.be.eql("male")
         } 

         testFn("John", "john@mail.com", "male")
    })
    it("should assign values to optional parameter placed at start ", () => {
        function testFn() {
            let [name, email, age, gender] = parseArgs(arguments, "[name] , email , age, gender", {
                args: ['vin', 'diesel@mail.com', 34, "female"]
            })

            name.should.be.eql("vin")
            email.should.be.eql("john@mail.com")
            age.should.be.eql(35)
            gender.should.be.eql("male")
         } 

         testFn("john@mail.com", 35, "male")
    })
    it("should assign values to optional parameter placed in the end", () => {
        function testFn() {
            let [name, email, age, gender] = parseArgs(arguments, "[name] , email , age [, gender]", {
                args: ['vin', 'diesel@mail.com', 34, "female"]
            })

            name.should.be.eql("john")
            email.should.be.eql("john@mail.com")
            age.should.be.eql(35)
            gender.should.be.eql("female")
         } 

         testFn("john", "john@mail.com", 35)
    })
    it("should parse even if pattern contains comma before Open braces", () => {
        function testFn() {
            let [name, email, age, gender] = parseArgs(arguments, "[name] , [email] , age , gender", {
                args: ['vin', 'diesel@mail.com', 34, "female"]
            })

            name.should.be.eql("john")
            email.should.be.eql("diesel@mail.com")
            age.should.be.eql(35)
            gender.should.be.eql("male")
         } 

         testFn("john", 35, "male")
    })
    it("should parse pattern irrespective of comma position", () => {
        function testFn() {
            let [name, email, age, gender] = parseArgs(arguments, "[name] [, email] , age [, gender]", {
                args: ['vin', 'diesel@mail.com', 34, "female"]
            })

            name.should.be.eql("john")
            email.should.be.eql("john@mail.com")
            age.should.be.eql(35)
            gender.should.be.eql("female")
         } 

         testFn("john", "john@mail.com", 35)
    })
})