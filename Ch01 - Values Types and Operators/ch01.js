console.log("Hello World again");

console.log(Infinity - Infinity); // NaN

console.log("First line\nSecond line");
console.log("Con" + "cat");
console.log(`half of 100 is ${100/2}`)

console.log(typeof 4.5);

/* NaN is supposed to denote the result of a nonsensical computation */

console.log(true ? 1 : 2); // 1

/* Empty Values
    null and undefined
    
    Many operations that don't produce meaningful value yield `undefined`
    simply because they have to yield SOME value.

    The difference between null and undefined doesn't matter most of the time.
    It is an accident of JS's design.
*/

/* Auto type conversion

*/
console.log(8 * null); // 0
console.log("5" - 1); // 4
console.log("5" + 1); // 51 string
console.log(false == 0); // true
console.log(null == undefined); // true
console.log(null === undefined); // false



