// Abstracting Repetition //
////////////////////////////

// Passing funcs as values

function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i);
    }
}

repeat(3, console.log);


let labels = [];
repeat(5, a => {
    labels.push(`Unit ${a + 1}`);
});
console.log(labels);

// High-Order funcitons //
//////////////////////////

/*
    Functions that operate on other functions, either by taking them as
    arguments or by returning them.

    Action abstraction.
*/

// Funcs creating new funcs
function greaterThan(n) {
    return m => m > n;
}
let greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));


// Funcs that change other funcs
function noisy(f) {
    return (...args) => {
        console.log("calling with", args);
        let result = f(...args);
        console.log("called with", args, ", returned", result);
        return result;
    };
}

noisy(Math.min)(3, 2, 1);

// Funcs that provide new type of control flow
function unless(test, then) {
    if (!test) then();
}
repeat(3, n => {
    unless(n % 2 == 1, () => {
        console.log(n, "is even");
    });
});


// Built-in array method, forEach
["A", "B"].forEach(l => console.log(l));


// Filtering Arrays //
//////////////////////

// Getting a subset of an array based on a test

// a pure func (returns new array rather than modifying existing)
function myFilter(array, test) {
    let passed = [];
    for (let element of array) {
        if (test(element)) {
            passed.push(element);
        }
    }
    return passed;
}

// returns array of scripts that are currently being used
console.log(myFilter(SCRIPTS, script => script.living));

// filter is a standard array method. myFilter works similarly.
// This filters the scripts that are written "top to bottom"
console.log(SCRIPTS.filter(s => s.direction == "ttb"));

// Transforming With Map //
///////////////////////////

// Applying a func for each element of an array

function map(array, transform) {
    let mapped = [];
    for (let elem of array) {
        mapped.push(transform(elem));
    }
    return mapped;
}

let rtlScripts = SCRIPTS.filter(s => s.direction == "rtl");
console.log(map(rtlScripts, s => s.name));

// Like forEach, map is also an array method
console.log(rtlScripts.map(s => s.name));


// Summarizing With Reduce //
/////////////////////////////

// Getting a single value out of an array

// Sometimes also called `fold`

function reduce(array, combine, start) {
    let current = start;
    for (let element of array) {
        current = combine(current, element);
    }
    return current;
}

console.log(reduce([1, 2, 3, 4], (a, b) => a + b, 0));

// The standart array method reduce allows to leave off the `start` argument
// if the array has at least one element

console.log([1, 2, 3, 4].reduce((a,b) => a + b));
console.log([].reduce((a,b) => a + b, 0)); // Error if no 2nd arg


/*
    Finding script with most characters

    characterCount sums the number of unicode chars for each script

    The 2nd reduce keeps track of the script with the most characters
*/

function characterCount(script) {
    return script.ranges.reduce((count, [from,to]) => {
        return count + (to - from);
    }, 0);
}

console.log(SCRIPTS.reduce((a, b) => {
    return characterCount(a) < characterCount(b) ? b : a;
})); // -> "Han"


// Finding average year of origin for living vs dead scripts
function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
}
console.log(Math.round(average(
    SCRIPTS.filter(s => s.living).map(s => s.year)
)));
console.log(Math.round(average(
    SCRIPTS.filter(s => !s.living).map(s => s.year)
)));

// same, but as a loop. Less computer intensive (doesn't create new arrays)
let living_total = 0, living_count = 0;
for (let script of SCRIPTS) {
    if (script.living) {
        living_total += script.year;
        living_count++;
    }
}
console.log(Math.round(living_total/living_count));

let dead_total = 0, dead_count = 0;
for (let script of SCRIPTS) {
    if (!script.living) {
        dead_total += script.year;
        dead_count++;
    }
}
console.log(Math.round(dead_total/dead_count));


// Strings and Character Codes //
/////////////////////////////////

// Given a certain script code, try to find the corresponding script
// by checking each of the script's ranges

function characterScript(code) {
    for (let script of SCRIPTS) {
        if (script.ranges.some(([from, to]) => {
            return code >= from && code < to;
        })) {
            return script;
        }
    }
    return null;
}

// The `some` method tells you if the function returns true for any of the elements

console.log(characterScript(121)); // -> {name: "Latin"...

/*
    JS strings are encoded as a sequence of 16-bit numbers called `code units`

    Unicode was initially supposed to fit within 16 bits (~65k chars)

    When it became clear 16 bits wasn't gonna be enough, people complained about the
    extra memory per char.

    To address those concerns, UTF-16, format used by JS strings, was invented.

    UTF-16 describes most common chars using single 16-bit code unit but uses a pair
    of code units for others.

    UTF-16 is generally considered bad idea. Easy to write programs that treat common
    chars and uncommon ones (using a pair of code units) as the same, bringing mistakes.

    With the advent of emoji, many people started using two-unit characters.

    Obvious operations on JS strings (e.g. length, []) deal only with code units
*/

let horseShoe = "A🐴👟";
console.log(horseShoe.length); // -> 5
console.log(horseShoe[0]); // -> A
console.log(horseShoe[1]); // -> invalid half-character. appears as empty square
console.log(horseShoe.charCodeAt(0)); // -> 65
console.log(horseShoe.charCodeAt(1)); // -> Code of the (invalid) half-character
console.log(horseShoe.codePointAt(0)); // -> 65
console.log(horseShoe.codePointAt(1)); // -> Code of the actual horse emoji
 
/*
    charCodeAt gives you a code unit, not a full char code.

    codePointAt, added later, gives you full unicode character.

    To run over all characters in a string, we'd still need to deal with the question
    of whether a character takes up one or two code units

    the for/of loop was introduced at a time where people were aware of the problems
    with UTF-16, so it gives you real characters, not code units.
*/

let roseDragon = "A🌹B🐉C";
for (let char of roseDragon) {
    console.log(char); // -> actual chars
}

// Recognizing Text //
//////////////////////

// countBy expects a collection (loopable with for/of) and a function that
// computes a group name for a given element.
// Returns an array of objects, each of which names a group and tells you
// the numbers of elements that were foun in that group.
function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
        let name = groupName(item);
        let known = counts.findIndex(c => c.name == name);
        if (known == -1) {
            counts.push({name, count: 1});
        } else {
            counts[known].count++;
        }
    }
    return counts;
}

// findIndex finds the first value for which the given function returns true.
// Returns -1 when not found

console.log(countBy([1, 2, 3, 4, 5], n => n > 2));
// -> [{name: false, count: 2}, {name: true, count: 3}]


// Finding which scripts are used in a piece of text, using countBy
function textScripts(text) {
    let scripts = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.name : "none";
    }).filter( ({name}) => name != "none" );

    let total = scripts.reduce((n, {count}) => n + count, 0);
    if (total == 0) return "No scripts found";

    return scripts.map(({name, count}) => {
        return `${Math.round(count * 100 / total)}% ${name}`;
    }).join(", ");
}

console.log(textScripts('英国的狗说"woof",俄罗斯的狗说"тяв"'));
// -> 61% Han, 22% Latin, 17% Cyrillic
