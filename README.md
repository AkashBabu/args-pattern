# parse-args
A Nodejs lib that arranges the arguments passed to a function based on pattern string

### Description

This library intends to help the developers to maintain backwards compatibility in their
functions, by making and maintaining optional parameters, and not worrying to write 
code to assign the correct values to the arguments


### Installation 

> npm install parse-args -S

### Typical Example of optional parameters
```javascript
// params ([name], [email], age, [gender])
function testFn(name="vin", email="diesel@mail.com", age, gender="female"){
    if(!email) {
        age = name;
        name = "vin"
    } else if (!age) {
        age = email
        email = "diesel@mail.com"
    }
  
}

testFn("john", 34)

```


### Example after using this library

```javascript
var parseArgs = require("parse-args")
function testFn() {
    let [name, email, age, gender] = parseArgs(arguments, "[name] [, email] , age [, gender]", {
        args: ['vin', 'diesel@mail.com', 34, "female"]
    })

// Output name === "john"
// Output email === "diesel@mail.com"
// Output age === 35
// Output gender === "female"
} 

testFn("john", 35)

```

Even though the real world examples can get a little more complicate, `parse-args` library
will be there to rescue, so that you can avoid a lot of spaghetti code :thumbsup: 


### Test

> npm install  
> mocha test.js

### License
MIT