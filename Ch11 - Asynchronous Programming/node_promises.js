const fs = require("fs");

// Synchronous function
function readJSONSync(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}


// Naive async implementation
function readJsonNaive(filename, callback) {
    fs.readFile(filename, 'utf8', function (err, res) {
        if (err) return callback(err);
        callback(null, JSON.parse(res));
    })
}
// * extra callback param confuses our idea of what is input and what is the
//   return value
// * does not work at all with control flow primitives
// * does not handle errors thrown by JSON.parse

// Mess async implementation
function readJsonMess(filename, callback) {
    fs.readFile(filename, 'utf8', function (err, res) {
        // Handling file read errors
        if (err) return callback(err);
        // handling JSON errors
        try {
            res = JSON.parse(res);
        } catch (ex) {
            return callback(ex);
        }
        // returning success
        callback(null, res);
    })
}
// Still with the extra callback

// What is a promise //
///////////////////////

/**
 * A promise represents the result of an asynchronous operation.
 * 
 * A promise is in one of three different states:
 * -> pending
 * -> fulfilled
 * -> rejected
 * 
 * Once a promise is fulfiled or rejected, it is immutable
 */

// Constructing a promise //
////////////////////////////

function readFile(filename, enc) {
    return new Promise(function (fulfill, reject) {
        fs.readFile(filename, enc, function (err, res) {
            if (err) reject(err);
            else fulfill(res);
        });
    });
}
/**
 * `new Promise` contructs the promise
 * 
 * Give the constructor a factory function which does the actual work
 * 
 * This function is called immediately with 2 arguments.
 * 
 * The first argument fulfills the promise
 * 
 * The second argument rejects the promise
 * 
 * once operation is completed, we call the appropriate function
 */