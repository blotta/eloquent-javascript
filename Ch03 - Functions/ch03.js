console.log("Chapter 3 - Functions");

const square = function(x) {
    return x * x;
};

console.log(square(12));


const makeNoise = function() {
    console.log("Ping!");
};

console.log(makeNoise()); // returns undefined

// lexical scoping - Each local scope can see all the local scopes that contain it
// and all scopes can see the global scope
const hummus = function(factor) {
    const ingredient = function(amount, unit, name) {
        let ingredientAmount = amount * factor;
        if (ingredientAmount > 1) {
            unit += "s";
        }
        console.log(`${ingredientAmount} ${unit} ${name}`);
    };
    ingredient(1, "can", "chickpeas");
    ingredient(0.25, "cup", "tahini");
    ingredient(0.25, "cup", "lemon juice");
    ingredient(1, "clove", "garlic");
    ingredient(2, "tablespoon", "olive oil");
    ingredient(0.5, "teaspoon", "cumin");
};

// ingredient(1, "can", "chickpeas"); // error
hummus(2);


// Declaration Notation
console.log("The future says: ", future());

function future() {
    return "You'll never have flying cars";
}

/*
    This works, even though the func is declared after calling it.
    Function declaratinos are not part of the regular top-to-bottom flow
    control. They are conceptually moved to the top of their scope and can be
    used by all the code in that scope.
*/

// Arrow Functions //
/////////////////////

/*
    Added in 2015, mostly to make it possible to write small function expressions
    in a less verbose way. No deep reason to have both arrow functions and function
    expressions in the language.
*/

const power = (base, exponent) => {
    let result = 1;
    for (let count = 0; count < exponent; count++) {
        result *= base;
    }
    return result;
};

console.log(power(2, 3));

// same
const square1 = (x) => { return x * x };
const square2 = (x) => x * x;


// Optional Arguments //
////////////////////////

/*
    If you pass too many args, the extra are ignored. If you pass too few, the
    missing parameters get assigned the value of `undefined`.
*/

function minus(a, b) {
    if (b === undefined) return -a;
    else return a - b;
}

// `=` operator after a param, followed by expression, gives default value to arg

function another_power(base, exponent = 2) {
    let result = 1;
    for (let count = 0; count < exponent; count++) {
        result *= base;
    }
    return result;
}

console.log(another_power(4)); // 4^2


// Closure //
/////////////

/*
    closure: being able to reference a specific instance of a local binding in
    an enclosing scope.
*/

function wrapValue(n) {
    let local = n;
    return () => local;
}
let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1()); // 1
console.log(wrap2()); // 2


function multiplier(factor) {
    return (num) => { return num * factor; };
}
let twice = multiplier(2);
console.log(twice(3)); // 6


// Recursion //
///////////////

/*
    Recursion is now always just an inefficient alternative to looping. Some
    problems really are easier to solve with loops. Most often these are problems
    that require exploring or processing several "branches", each of which might
    branch out again into even more branches.
*/

function findSolution(target) {
    function find(current, history) {
        if (current == target) {
            return history;
        } else if (current > target) {
            return null;
        } else {
            return find(current + 5, `(${history} + 5)`) ||
                   find(current * 3, `(${history} * 3)`)
        }
    }
    return find(1, "1");
}

console.log(findSolution(34)); // 34 --> (((((1 * 3) + 5) * 3) + 5) + 5)
