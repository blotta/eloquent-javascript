// "use strict";

// Strict Mode //

// "use strict" on top of file or function

function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++) {
    console.log("Happy happy");
  }
}

// canYouSpotTheProblem();
// -> Reference Error: assignment to undeclared variable counter

/**
 * Another change in strict mode is that the `this` binding holds the value
 * undefined in functions that are not called as methods.
 *
 * without strict mode, `this` refers to the gloabl scope object, which is an
 * object whose properties are the global bindings.
 */

// "use strict"; (top of file)
function Person(name) {
  this.name = name;
}
let lucas = Person("Lucas"); // forgot `new`
// -> TypeError
console.log(name); // -> Lucas
console.log(lucas); // -> undefined

// Testing //
/////////////

function test(label, body) {
  if (!body()) console.log(`Failed: ${label}`);
}

test("convert Latin text to uppercase", () => {
  return "hello".toUpperCase() == "HELLO";
});
test("convert Greek text to uppercase", () => {
  return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ";
});
test("don't convert case-less characters", () => {
  return "مرحبا".toUpperCase() == "مرحبا";
});

//  Generally, the more external objects that the code interacts with, the
// harder it is to set up the context in which to test it

// Error Handling //
////////////////////

// throw, try, catch, Error
function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new Error("Invalid direction: " + result);
}

function look() {
  if (promptDirection("Which way?") == "L") {
    return "a house";
  } else {
    return "two angry bears";
  }
}

// try {
//   console.log("You see", look());
// } catch (error) {
//   console.log("Something went wrong: " + error);
// }

// Banking Code
// finally
const accounts = {
  a: 100,
  b: 0,
  c: 20
};

function getAccount() {
  let accountName = prompt("Enter an account name");
  if (!accounts.hasOwnProperty(accountName)) {
    throw new Error(`No such account: ${accountName}`);
  }
  return accountName;
}

// Bad code. Money disappears if throw runs
function transferBad(from, amount) {
  if (accounts[from] < amount) return;
  accounts[from] -= amount;
  accounts[getAccount()] += amount;
}

// Better code
function transfer(from, amount) {
  if (accounts[from] < amount) return;
  let progress = 0;
  try {
    accounts[from] -= amount;
    progress = 1;
    accounts[getAccount()] += amount;
    progress = 2;
  } finally {
    // Only runs when exception is thrown
    if (progress == 1) {
      accounts[from] += amount;
    }
  }
}

// Best if possible to compute new values instead of changing existing ones

// Selective Catching //
////////////////////////

class InputError extends Error {}

function promptDirection2(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}

// for (;;) {
//   try {
//     let dir = promptDirection2("Where?");
//     console.log("You chose ", dir);
//     break;
//   } catch (e) {
//     if (e instanceof InputError) {
//       console.log("Not a valid direction. Try again.");
//     } else {
//       throw e;
//     }
//   }
// }

// Assertions //
////////////////

function firstElement(array) {
  if (array.length == 0) {
    throw new Error("firstElement called with []");
  }
  return array[0];
}
