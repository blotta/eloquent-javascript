// ----- Modules ----- //
/////////////////////////

// Mostly obsolete module approach
const weekDay = (function () {
  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return {
    name(number) {
      return names[number];
    },
    number(name) {
      return names.indexOf(name);
    },
  };
})();

console.log(weekDay.name(weekDay.number("Sunday")));

// If we wanto to make dependency relations part of the code
// we'll have to take control of loading dependencies. Doing
// that requires being able to execute strings as code.
// Javascript can do that.

// Evaluating Data as Code //
/////////////////////////////

/**
 * Eval
 * Executes a string in the current scope.
 * Bad idea
 */

const x = 1;
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2")); // 2
console.log(x); // 1

/**
 * Function constructor
 * 2 args
 * -- comma-separated string list of argument names
 * -- string with function body
 *
 * Wraps the code in a function value so that it gets its own
 * scope and won't do thing with other scopes.
 */

let plusOne = Function("n", "return n + 1;");
console.log(plusOne(4)); // 5

// CommonJS //
//////////////

/**
 * Most widely used approach to bolted-on JavaScript modules
 *
 * Node.js uses it and is the system used by most packages on NPM
 *
 * Main concept in CommonJS modules is a function called `require`. When you
 * call this with the module name of a dependency, it makes sure the module is
 * loaded and returns its interface.
 *
 * The loader wraps the module code in a function, so modules automatically
 * get their own local scope. All they have to do is call require to access
 * their dependencies and put their interfaces in the object bound to
 * `exports`.
 *
 */

// Example module

// const ordinal = require("ordinal");
// const { days, months } = require("date-names");

// exports.formatDate = function (date, format) {
//   return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, (tag) => {
//     if (tag == "YYYY") return date.getFullYear();
//     if (tag == "M") return date.getMonth();
//     if (tag == "MMMM") return months[date.getMonth()];
//     if (tag == "D") return date.getDate();
//     if (tag == "Do") return ordinal(date.getDate());
//     if (tag == "dddd") return days[date.getDay()];
//   });
// };

// The module adds its interface function to `exports` so that modules that depend
// on it get access to it. Use module like this:

// const { formatDate } = require("./format-date");
// console.log(formatDate(new Date(2017, 9, 13), "dddd the Do"));
// // -> Friday the 13th

// Defining minimal `require`
require.cache = Object.create(null);

function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name); // not actual function in vanilla js
    let module = { exports: {} };
    require.cache[name] = module;
    let wrapper = Function("require, exports, module", code);
    wrapper(require, module.exports, module);
  }
  return require.cache[name].exports;
}

// ECMAScript Modules //
////////////////////////

/**
 * CommonJS modules remain a bit of a duct-tape hack
 * -- awkward notation
 * -- things in exports not available in local scope
 * -- Hard to determine dependencies of a modules without runnig its code, since
 *    `require` is a normal function call taking any kind of argument
 *
 * This is why the JavaScript standard from 2015 introduces its own module system.
 *
 * Called ES modules
 *
 */

// import ordinal from "ordinal";
// import {days, months} from "date-names";

// export function formatDate(date, format) { /*...*/ }

/**
 * Notation is now integrated into language.
 *
 * `export` keyword used to export things. May appear in front of function, class
 * or binding definition (let, const, var)
 *
 * When you import from another module, you import the binding, not the value.
 *
 * Binding named "default" is treated as the module's main exported value. If you
 * import a module like `ordinal` in the example, without braces around the binding
 * name, you get its `default` binding. Other bindings can be exported alongside the
 * default one.
 *
 * To create a default export, you write export default before an expression, a
 * function declaration, or a class declaration
 */

// export default ["Winter", "Spring", "Summer", "Autumn"];

// possible to rename imported bindings

// import { days as dayNames } from "date-names";
// console.log(dayNames.length); // 7

/**
 * ES modules imports happen BEFORE a module's script starts running.
 *
 * import declarations may not appear inside functions or blocks and the names of
 * dependencies must be quoted strings, not arbitrary expressions.
 */
