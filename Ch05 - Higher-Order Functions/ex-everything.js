/*
    every tests if all elements pass a test function.

    some tests if at least one element passes a test function

    My logic was, if some pass the test and some don't pass the test,
    not every element passes the test. Didn't know how to negate the test.
*/
function everyWithSome(array, test) {
    return array.some(test) && !array.some(test);
}

// answer
// if some don't pass the test (!test), then not every elem passes the test
function everyWithSomeFromBook(array, test) {
    return !array.some(e => !test(e));
}

function everyWithLoop(array, test) {
    for (let e of array) {
        if (!test(e)) {
            return false;
        }
    }
    return true;
}

let arr = [2, 3, 4, 5, 10];

console.log(arr.every(e => e < 11));
console.log(everyWithLoop(arr, e => e < 11));
console.log(everyWithSome(arr, e => e < 11));
console.log(everyWithSomeFromBook(arr, e => e < 11));

