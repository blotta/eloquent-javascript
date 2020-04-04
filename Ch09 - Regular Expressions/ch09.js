// ----- Regular Expressions ----- //
/////////////////////////////////////

// Creating //
//////////////

// Either with RegExp constructor or writtern as a literal

let re1 = new RegExp("abc");
let re2 = /abc/;

// Testing //
/////////////

console.log(/abc/.test("abcdr")); // true
console.log(/abc/.test("abxdr")); // false

// Sets of Characters //
////////////////////////

console.log(/[0-9]/.test("in 1991")); // true

/**
 * \d digit (same as [0-9])
 * \w alphanumeric
 * \s whitespace (space, tab, newline, etc)
 * \D NOT a digit
 * \W nonalphanumerical
 * \S nonwhitespace
 * .  any character except for newline
 */

let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/; // DD-MM-YYYY HH:MM
console.log(dateTime.test("01-03-2003 15:20")); // true

// The backslash codes can also be used inside square brackets.
// e.g [\d.] means any digit or a period. Period loses special meaning.
// invert with ^. e.g. [^\d] means any non-digit character

let notBinary = /[^01]/;
console.log(notBinary.test("110101")); // false
console.log(notBinary.test("110201")); // true

// Repeating Parts of a Pattern //
//////////////////////////////////

// + indicates elements may be repeated more than once
// \d+ matches one or more digit characters
// * is similar but it can match zero or more times
// \d* matches zero or more digit characters

console.log(/'\d+'/.test("'123'")); // true
console.log(/'\d+'/.test("''")); // false
console.log(/'\d*'/.test("'123'")); // true
console.log(/'\d*'/.test("''")); // true

// ? makes part of a pattern optional.
// \d? matches zero or one digits
let neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour")); // true
console.log(neighbor.test("neighbor")); // true

// Braces indicate that a pattern should occur a precise number of times.
// \d{4} requires a digit to occur 4 times
// \d{2,4} requires to occur at least twice and at most 4 times
// \d{2,} requires to occur at least twice

let dateTime2 = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime2.test("1-03-2003 7:20")); // true

// Grouping Subexpressions //
/////////////////////////////

// i makes the regular expression case insensitive

let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Booooohooohoohoo")); // true

// Matches and Groups //
////////////////////////

// 'test' will return true when there's a match, false when there's not
// 'exec'  returns null when there's no match, but returns an object with
//         information about the match otherwise.

let match = /\d+/.exec("one two 100 40");
console.log(match); // -> ["100"]
console.log(match.index); // -> 8

// Other than the index, which says where in the string the match begins,
// the object is in fact an array of strings.

// String values have a similar `match` method
console.log("one two 100 40".match(/\d+/)); // -> ["100"]

// When the regex contains subexpressions groupes with parentheses,
// the whole match is always the first element, followed by the
// matched groups.

let quotedText = /'([^']*)'/;
console.log(quotedText.exec("she said 'hello'"));
// -> ["'hello'", "hello"]

// When a group is not matched, its position will hold undefined
console.log(/bad(ly)?/.exec("bad")); // -> ["bad", undefined]

// When a group matches multiple times, only last match ends up in array
console.log(/(\d)+/.exec("123")); // -> ["123", "3"]

// The Date Class //
////////////////////

console.log(new Date());

// Month numbers start at 0. Days at 1
console.log(new Date(2009, 11, 9)); // This is December 9th of 2009

console.log(new Date(2009, 11, 9, 12, 59, 59, 999));

// stored as milliseconds since 1970
console.log(new Date(2013, 11, 19).getTime());
console.log(new Date(1387418400000));
console.log(new Date(1970, 0, 1).getUTCMilliseconds()); // -> 0

function getDate(string) {
  let [_, month, day, year] = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));

// Word and String Boundaries //
////////////////////////////////

//   /^\d+&/ entirely one or more digits

//   \b (word boudary) can be the start or end of the string
//   or any point in the string that has a word character (as in \w)
//   on one side and a nonword character on the other.

console.log(/cat/.test("concatenate")); // -> true
console.log(/\bcat\b/.test("concatenate")); // -> false
console.log(/\bcat\b/.test("concatenate cat")); // -> true
console.log(/\bcat\b/.test("-cat-")); // -> true

// Choice Patterns //
/////////////////////

let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs")); // true
console.log(animalCount.test("15 pigchickens")); // false

// The Mechanics of Matching //
///////////////////////////////

// --> /\b\d+ (pig|cow|chicken)s?\b/;
/**
 * Flow
 *
 *                            |   Group 1   |
 *                             /--- pig ---\   /--> bypass >--\
 * boundary --> digit - " " ------- cow ------------- "s" ------- boundary
 *           \-<loop<-/        \- chicken -/
 */

// Replace Method //
////////////////////

console.log("papa".replace("p", "m")); // mapa
console.log("papa".replace(/p/g, "m")); // mama

// Real power comes from matched group reference

console.log(
  "Liskov, Barbara\nMacCarthy, John\nWadler, Philip".replace(
    /(\w+), (\w+)/g,
    "$2 $1"
  )
);

// Possible to pass a function as arg

let s = "the cia and fbi";
console.log(
  s.replace(/\b(fbi|cia)\b/g, str => {
    console.log(str);
    return str.toUpperCase();
  })
);

let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1) {
    // only one left, remove the "s"
    unit = unit.slice(0, unit.length - 1);
  } else if (amount == 0) {
    amount = "no";
  }
  return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
// -> no lemon, 1 cabbage, and 100 eggs

// Greed //
///////////

// Function to remove comments
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}
console.log(stripComments("1 + /* 2 */3")); // 1 + 3
console.log(stripComments("x = 10;// ten!")); // x = 10;
console.log(stripComments("1 /* a */+/* b */ 1")); // 1  1

// [^] matches any character. A period (.) would not work
// because block comments can continue on a new line and
// a period doesn't match newline chars

/**
 * [^] does not work as expected on the last example. Because
 * of backtracking, the matcher first tries to match the rest
 * of the string and goes back from there.
 *
 * Because of this behavior, repetition operators (+, *, ?, and {})
 * are `greedy`, matching as much as they can and backtrack from there.
 *
 * Putting a question mark after them (+?, *?, ??, {}?), makes them
 * nongreedy and start matching as little as possible.
 *
 */

function stripCommentsNongreedy(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
console.log(stripCommentsNongreedy("1 /* a */+/* b */ 1")); // 1 + 1

// Dynamically Creating RegExp Objects //
/////////////////////////////////////////

// You may not be able to use slash-based notation.
// Build up a string and use the RegExp constructor on that.

let name = "harry";
let text = "Harry is a suspicious character.";
let regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// -> _Harry_ is a suspicious character.

let name2 = "dea+hl[]rd";
let text2 = "This dea+hl[]rd guy is super annoying.";
let escaped = name2.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp2 = new RegExp("\\b" + escaped + "\\b", "gi");
console.log(text2.replace(regexp2, "_$&_"));
// → This _dea+hl[]rd_ guy is super annoying.

// The Search Method //
///////////////////////

// Returns first index on which exp was found or -1
console.log("  word".search(/\S/)); // 2

// Last Index //
////////////////

let rg = /abc/g; // global
let ry = /abc/y; // sticky: matches only by starting directly at lastIndex

console.log(rg.exec("xyz abc")); // ["abc"]
console.log(ry.exec("xyz abc")); // null
ry.lastIndex = 4;
console.log(ry.exec("xyz abc")); // ["abc"]

// shared regexp value for multiple exec calls have automatic
// updates to the lastIndex property. It can cause problems.

let digit_1 = /\d/g;
console.log(digit_1.exec("here it is: 1")); // ["1"]
console.log(digit_1.lastIndex); // 13
console.log(digit_1.exec("and now: 1")); // null

// global expression with `match` will return array with all matches
console.log("Banana".match(/an/)); // ["an"]
console.log("Banana".match(/an/g)); // ["an", "an"]

// Looping Over Matches //
//////////////////////////

let input = "A string with 3 numbers in it... 42 and 88";
let number_1 = /\b\d+\b/g;
let match_1;
while ((match_1 = number_1.exec(input))) {
  console.log("Found", match_1[0], "at", match_1.index);
}

// Parsing an INI File //
/////////////////////////

/*
searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn
*/

/**
 *
 * -- Blank lines and lines starting with semicolons are ignored
 * -- Lines wrapped in [ and ] start new section
 * -- Lines containing an alhpanumeric identifier followed by an =
 *  character add a setting to the current section
 * -- Anything else is invalid
 */

function parseINI(string) {
  // obj to hold top level fields
  let result = {};
  let section = result;
  string.split(/\r?\n/).forEach(line => {
    let match;
    if ((match = line.match(/^(\w+)=(.*)$/))) {
      section[match[1]] = match[2];
    } else if ((match = line.match(/^\[(.*)\]$/))) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}

console.log(
  parseINI(`
name=Vasilis
[address]
city=Tessaloniki`)
);

// International Characters //
//////////////////////////////

// é or β will not match \w (and will match uppercase \W,
// the nonword category).

// \s matches all characters that the Unicode standard
// considers whitespace

// by default, regular expressions work on code units, not
// actual characters.

console.log(/🍎{3}/.test("🍎🍎🍎"));
// → false
console.log(/<.>/.test("<🌹>")); // dot matches single code unit
// → false
console.log(/<.>/u.test("<🌹>"));
// → true

// `u` option treats characters properly

// \p matches all characters to which the Unicode standard assigns
// a given property
// Firefox error: "SyntaxError: invalid identity escape in regular expression"

// console.log(/\p{Script=Greek}/u.test("α"));
// // → true
// console.log(/\p{Script=Arabic}/u.test("α"));
// // → false
// console.log(/\p{Alphabetic}/u.test("α"));
// // → true
// console.log(/\p{Alphabetic}/u.test("!"));
// // → false
