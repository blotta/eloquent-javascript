
let my_list = [1,2,3,4];

console.log(typeof(my_list));

console.log(my_list.length, my_list["length"]);

my_list.push(5);
console.log(my_list);
console.log(my_list.pop());
console.log(my_list);

// Objects //
/////////////

let day1 = {
    squirrel: false,
    events: ["work", "touched tree", "pizza", "running"]
};

console.log(day1.squirrel);
console.log(day1.wolf);
day1.wolf = false;
console.log(day1.wolf);

// Properties whose names aren't valid binding names or valid numbers have
// to be quoted

let descriptions = {
    work: "Went to work",
    "touched tree": "Touched a tree"
};

// Possible to delete properties
delete descriptions.work;

console.log(descriptions);

// get keys
console.log(Object.keys({x: 0, y: 0, z:2}));

// Object.assign copies al properties from one object into another
let objectA = {a: 1, b: 2};
Object.assign(objectA, {b: 3, c: 4});
console.log(objectA);

// Mutability //
////////////////

// obj1 and obj2 grasp the same object (they have the same identity)
// obj3 points to a different object.

let obj1 = {value: 10};
let obj2 = obj1;
let obj3 = {value: 10};

console.log(obj1 == obj2); // true
console.log(obj1 == obj3); // false

obj1.value = 15;
console.log(obj2.value); // 15

const score = {visitors: 0, home: 0};
// This is ok
score.visitors = 1;
// This is not allowed
// score = {visitors: 1, home: 0};


// Function to calculate corelation between frequencies of 2 elems (a and b)
// takes in array [f_none, f_b, f_a, f_ab]
// returns -1 to 1.
// * 0 means no corelation.
// * 1 means direct corelation.
// * -1 means reverse corelation
function phi(table) {
    return (table[3] * table[0] - table[2] * table[1]) /
        Math.sqrt((table[2] + table[3]) *
                   (table[0] + table[1]) *
                   (table[1] + table[3]) *
                   (table[0] + table[2]));
}
console.log(phi([76, 9, 4, 1])); // 0.068599434

function tableFor(event, journal) {
    let table = [0, 0, 0, 0];
    for (let i = 0; i < journal.length; i++) {
        let entry = journal[i], index = 0;
        if (entry.events.includes(event)) index += 1;
        if (entry.squirrel) index += 2;
        table[index] += 1;
    }
    return table;
}

// from journal.js
console.log(tableFor("pizza", JOURNAL)); // -> [76, 9, 4, 1]

for (let entry of JOURNAL) {
    console.log(`${entry.events.length} events.`); // -> 3 events\n5 events...etc
}

// Returns non repeating events in an array
function journalEvents(journal) {
    let events = [];
    for (let entry of journal) {
        for (let event of entry.events) {
            if (!events.includes(event)) {
                events.push(event);
            }
        }
    }
    return events;
}

console.log(journalEvents(JOURNAL));

// phi for each event
// for (let event of journalEvents(JOURNAL)) {
//     console.log(event + " : ", phi(tableFor(event, JOURNAL)));
// }


// only events with phi larger than abs(0.1)
for (let event of journalEvents(JOURNAL)) {
    let correlation = phi(tableFor(event, JOURNAL));
    if (correlation > 0.1 || correlation < -0.1) {
        console.log(event + " : ", phi(tableFor(event, JOURNAL)));
    }
}

// peanuts : 0.59026, brushed teeth : -0.3805211
for (let entry of JOURNAL) {
    if (entry.events.includes("peanuts") &&
        !entry.events.includes("brushed teeth")) {
        entry.events.push("peanut teeth");
    }
}
// Turns into a squirrel when eats peanuts and fails to brush teeth
console.log(phi(tableFor("peanut teeth", JOURNAL))); // -> 1

// More Array Methods //
////////////////////////

// push and pop add and remove items from THE END of an array, respectively
// unshift and shift add and remove items from THE START of an array, respectively

let todoList = [];
// adds to end of list
function remember(task) {
    todoList.push(task);
}
// removes from the beginning of list
function getTask() {
    return todoList.shift();
}
// adds to the beginning of list
function rememberUrgently(task) {
    todoList.unshift(task);
}

/*
    Search for specific value with indexOf method.
    Returns index of item or -1 if not found
    Reverse search with lastIndexOf
    Both contain 2nd optional param to indicate where to start searching
*/
console.log([1, 2, 3, 2, 1].indexOf(2)); // -> 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2)); // -> 3


/*
    slice takes start and end indices and returns and array that has onle the
    elements between them.
    start is inclusive, end is exclusive
    omit end index to copy array starting from start index
    omit start index to copy entire array
*/
console.log([0, 1, 2, 3, 4].slice(2, 4)); // -> [2, 3]
console.log([0, 1, 2, 3, 4].slice(2)); // -> [2, 3, 4]
console.log([0, 1, 2, 3, 4].slice()); // -> same, but copy

/*
    concat method glues arrays together to create a new array, similar to what
    the + operator does to strings.
    Passing concat an arg that is not an array, that value will be added to the
    new array as if it were a one-element array
*/
// removes an item from an array
function remove(array, index) {
    return array.slice(0, index).concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2)); // -> ["a", "b", "d", "e"]


// Strings and Other Properties //
//////////////////////////////////

// slice and indexOf work on strings
console.log("coconuts".slice(4, 7)); // -> nut
console.log("coconuts".indexOf("u")); // -> 5

// indexOf for strings can search string with more than 1 char
console.log("one two three".indexOf("ee")); // -> 11

// trim removes whitespace from the start and end of a string
// whitespace: space, newline, tabs, etc
console.log("  >okay< \n".trim()); // -> ">okay<"

// padStart takes a length and a padding char
console.log(String(6).padStart(3, "0")); // -> 006

// split and join
let sentence = "Secretarybirds specialize in stomping";
let words = sentence.split(" "); // default is not " "
console.log(words);
console.log(words.join(". "));

// repeat creates a new string containing multiple copies of original
console.log("LA".repeat(3)); // -> LALALA

// as seen, length and accessing characters with []
let string = "abc";
console.log(string.length); // -> 3
console.log(string[1]); // -> b


// Rest Parameters //
/////////////////////

// Accept any number of args in a function by putting 3 dots (...)
// before the func's last parameter

function max(...numbers) {
    let result = -Infinity;
    for (let number of numbers) {
        if (number > result) result = number;
    }
    return result;
}
console.log(max(4, 1, 9, -2)); // -> 9

// Spread array elements as args
let numbers = [5, 1, 7];
console.log(max(...numbers)); // -> 7
console.log(max(9, ...numbers, 12)); // -> 12 

let words2 = ["never", "fully"];
console.log("will", ...words2, "understand"); // -> will never fully understand


// The Math Object //
/////////////////////

/*
    number-related utility functions
    max, min, sqrt, etc
    There is only 1 Math object. Used mainly as a namespace so that funcs and
    values do not have to be global binding
    Trigonometry: sin, cos, tan, asin, acos, atan, PI
*/

function randomPointOnCircle(radius) {
    let angle = Math.random() * 2 * Math.PI;
    return {x: radius * Math.cos(angle),
            y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));

// random returns a pseudorandom number between [0,1) (zero inclusive, one exclusive)
for (let n = 0; n < 3; n++) {
    console.log(Math.random());
}

// getting a whole random number
console.log(Math.floor(Math.random() * 10)); // [0,10)

// ceil rounds up
console.log(Math.ceil(Math.random())); // -> 1

// abs negates negative values
console.log(Math.abs(-12.3)); // -> 12.3


// Destructuring //
///////////////////

// rewriting phi func so to have bindings for the elements instead
// of a binding for the table
function phi2([n00, n01, n10, n11]) {
    return (n11 * n00 - n10 * n01) /
        Math.sqrt((n10 + n11) * (n00 + n01) *
                  (n01 + n11) * (n00 + n10));
}

console.log(phi2([76, 9, 4, 1])); // -> 0.06859943

// Also works for bidings creted with let, var, or const.
let [e0, e1] = ["elem0", "elem1", "elem2"];
console.log(e0, e1); // -> elem0 elem1

let {name} = {name: "Faraji", age: 23};
console.log(name); // -> Faraji

let [ imnull ] = [ null, 1, 2 ];
console.log(imnull);


// JSON //
//////////

// JSON is a way of Serialization
// JavaScript Object Notation

// {
//     "squirrel": false,
//     "events": ["work", "touched tree", "pizza", "running"]
// }

// Javascript has JSON.stringify and JSON.parse
let string2 = JSON.stringify({squirrel: false, events: ["weekend"]});
console.log(string2);
console.log(JSON.parse(string2).events);

