// Methods //
/////////////

function speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
}
// The binding called `this` automatically points at the object
// that it was called on.

let whiteRabbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRabbit.speak("How late it's getting!");

hungryRabbit.speak("I could use a carrot right now");


// If you want to pass `this` explicitly, use the `call` method.
speak.call(hungryRabbit, "Burp!");

/*
    You cannot refer to the `this` of the wrapping scope in 
    regular function (with function keyword).

    Arrow functions do not bind their own `this` but can see
    the `this` binding of the scope around them.
*/

function divByLen(n) {
    return n / this.length;
}

function normalize() {
    console.log(this.coords.map(n => n / this.length));
    console.log(this.coords.map(divByLen)); // -> doesn't work
}

normalize.call({coords: [0, 3, 4], length: 5});


// Prototypes //
////////////////

let empty = {};
console.log(empty.toString);
console.log(empty.toString());

// A prototype is another object that is used as a fallback
// source of properties. When an object gets a request for a
// property that is doesn't have, its prototype will be searched
// for the property, then the prototype's prototype, and so on.

// The prototype for an empty object is Object.prototype.
console.log(Object.getPrototypeOf({}) == Object.prototype);
// -> true
console.log(Object.getPrototypeOf(Object.prototype));
// -> null

// Functions derive from Functions.prototype
console.log(Object.getPrototypeOf(Math.max) == Function.prototype);
// -> true
// Arrays derive from Arrays.prototype
console.log(Object.getPrototypeOf([]) == Array.prototype);
// -> true

// Often, Object.prototype is the basis, so it can provide
// methods like toString
console.log(Object.getPrototypeOf(Array.prototype) == Object.prototype);
// -> true

// Object.create creates an object with a specific prototype
let protoRabbit = {
    speak(line) {
        console.log(`The ${this.type} rabbit says '${line}'`);
    }
};
let killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
killerRabbit.speak("SKREEE");

// Classes //
/////////////

// To create an instance of a given class, you have to make an
// object that derives from the proper prototype, but also have
// to make sure it, itself, has the properties that instances of
// this class are supposed to have. This is what a `constructor`
// does.

function makeRabbit(type) {
    let rabbit = Object.create(protoRabbit);
    rabbit.type = type;
    return rabbit;
}

// JS makes this easier. If you put the keyword `new` in front
// of a function call, the function is treated as a constructor,
// meaning an object with the right prototype is automatically
// created, bound to `this` in the function, and returned at
// the end of the function.
// Constructors (all funcs, in fact) automatically get a property
// named `prototype`, which by default holds an empty object
// that derives from Object.prototype.You can overwrite with a
// new object or add properties to the existing object, as the
// example does.

function Rabbit(type) {
    this.type = type;
}
Rabbit.prototype.speak = function(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
};

let weirdRabbit = new Rabbit("weird");

// The actual prototype od a constructor is Function.prototype since
// constructors are functions. Its prototype property holds the
// prototype used for instances created through it.

console.log(
    Object.getPrototypeOf(Rabbit) == Function.prototype);
// -> true
console.log(
    Object.getPrototypeOf(weirdRabbit) == Rabbit.prototype);
// -> true
console.log(Object.getPrototypeOf(
    Rabbit.prototype) == Object.prototype);
// -> true

// Class Notation //
////////////////////

// New notation created in 2015

class Duck {
    constructor(type) {
        this.type = type;
    }
    speak(line) {
        console.log(`The ${this.type} duck says '${line}'`);
    }
}

let killerDuck = new Duck("killer");
let blackDuck = new Duck("black");

// The earlier class declaration is equivalent to this one
// using the `class` keyword and `constructor` method

/*
    Class declarations currently allow only methods to be added
    to the prototype.

    Inconvenience when desiring to save non-functional values in
    a property.

    Next lang version will probably improve this.

    For now, create such properties by directly manipulationg the
    prototype after you've defined the class.
    e.g:
    let killerDuck = new Duck("killer");
    Duck.prototype.color = "White"; // changing "class"
    killerDuck.color = "Green"; // changing object (overrides)
*/

// console.log(Object.keys(killerDuck));
// killerDuck.color = "Green";
// console.log(Object.keys(killerDuck));

// `class` can be used in statement and in expressions. When used in
// expression, it doens't define a biding but just produces the
// constructor as a value.

let object = new class { getWord() { return "hello"; } };
console.log(object.getWord());


// Overriding Derived Properties //
///////////////////////////////////

Duck.prototype.teeth = "small";
console.log(killerDuck.teeth); // -> small
killerDuck.teeth = "long, sharp, and bloody";
console.log(killerDuck.teeth); // -> long, sharp, and bloody
console.log(blackDuck.teeth); // -> small
console.log(Duck.prototype.teeth); // -> small

// Maps //
//////////

// As in Dicts

// using objects as maps bring some problems
let ages0 = {
    Boris: 39,
    Liang: 22,
    Júlia: 62
};

console.log(`Júlia is ${ages0["Júlia"]}`);
// -> Júlia is 62
console.log("Is Jack's age known?", "Jack" in ages0);
// -> Is Jack's age known? false
console.log("Is toString's age known?", "toString" in ages0);
// -> Is toString's age known? true

// Using plain objects as maps is dangerous.
// There are several possible ways to avoid this problem.

// It is possible to create objects with no prototype. By passing
// null, it will not derive from Object.prototype and it is safe
// to be used as a map
console.log("toString" in Object.create(null));
// -> false

// Object property names must be strings.

// Object.keys returns only an object's own keys, not those in the
// prototype.

// JS comes with a class called Map that stores a mapping and allows
// any type of keys

let ages = new Map();
ages.set("Boris", 39);
ages.set("Liang", 22);
ages.set("Júlia", 62);

console.log(`Júlia is ${ages.get("Júlia")}`);
// -> Júlia is 62
console.log("Is Jack's age known?", ages.has("Jack"));
// -> Is Jack's age known? false
console.log("Is toString's age known?", ages.has("toString"));
// -> Is toString's age known? false

// the methods set, get and has are part of the interface of the
// Map object.


// Polymorphism //
//////////////////

// When a piece of code is written to work with objects that
// have a certain interface.



// Symbols //
/////////////

// Unlike strings, newly created symbols are unique-you
// cannot create the same symbol twice.

let sym = Symbol("name");
console.log(sym == Symbol("name"));
// -> false
Duck.prototype[sym] = 55;
console.log(blackDuck[sym]);
// -> 55

// The string passed to Symbol (e.g. "name") is included when you
// convert it to a string and can make it easier to recognize a
// symbol, but it has no meaning beyond that-multiple symbols
// may have the same name.
// Being unique and usable as property names makes symbols suitable
// to defining interfaces that can peacefully live alongside other
// properties

const toStringSymbol = Symbol("toString");
Array.prototype[toStringSymbol] = function() {
    return `${this.length} cm of blue yarn`;
};

console.log([1, 2].toString());
console.log([1, 2][toStringSymbol]());


// The Iterator Interface //
////////////////////////////

/*
    The object given to a for/of loop is expected to be iterable,
    meaning that it has a method named with the Symbol.iterator symbol
    (value defined by the language).

    When called, that method should return an object that provides a
    second interface, iterator, being the actual thing that iterates.
    It has a `next` method that returns the next result and a `done`
    value which should be true when there are no more results.
*/

// Using interface directly
let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next()); // -> {value: "O", done: false}
console.log(okIterator.next()); // -> {value: "K", done: false}
console.log(okIterator.next()); // -> {value: undefined, done: true}

// Implementing an iterable data structure: matrix acting as 2d array

class Matrix {
    constructor(width, height, element = (x, y) => undefined) {
        this.width = width;
        this.height = height;
        this.content = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.content[y * width + x] = element(x, y);
            }
        }
    }

    get(x, y) {
        return this.content[y * this.width + x];
    }
    set(x, y, value) {
        this.content[y * this.width + x] = value;
    }
}

// When looping over a matrix, x and y are of interest, so
// iterator will produce objects with x, y and value properties.

class MatrixIterator {
    constructor(matrix) {
        this.x = 0;
        this.y = 0;
        this.matrix = matrix;
    }

    next() {
        if (this.y == this.matrix.height) return {done: true};

        let value = {x: this.x,
                     y: this.y,
                     value: this.matrix.get(this.x, this.y)};
        
        this.x++;
        if (this.x == this.matrix.width) {
            this.x = 0;
            this.y++;
        }
        return {value, done: false};
    }
}

// Making Matrix class iterable. (If it wasn't for studying, we'd
// decalre this inside class instead )

Matrix.prototype[Symbol.iterator] = function() {
    return new MatrixIterator(this);
}

// Now we can loop a matrix with a for/of loop
let matrix = new Matrix(3, 2, (x, y) => `value ${x},${y}`);
for (let {x, y, value} of matrix) {
    console.log(x, y, value);
}

// Getters, setters ans statics //
//////////////////////////////////

// Getter

let varyinSize = {
    get size() {
        return Math.floor(Math.random() * 100);
    }
}
console.log(varyinSize.size);
console.log(varyinSize.size);

// Setter

class Temperature {
    constructor(celcius) {
        this.celcius = celcius;
    }
    get fahrenheit() {
        return this.celcius * 1.8 + 32;
    }
    set fahrenheit(value) {
        this.celcius = (value - 32) / 1.8;
    }

    static fromFahrenheit(value) {
        return new Temperature((value - 32) / 1.8);
    }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit); // -> 71.6
temp.fahrenheit = 86;
console.log(temp.celcius); // -> 30
let newTemp = new Temperature(Temperature.fromFahrenheit(71.6));
console.log(newTemp.celcius); // -> ~22


// Inheritance //
/////////////////

class SymmetricMatrix extends Matrix {
    constructor(size, element = (x, y) => undefined) {
        super(size, size, (x, y) => {
            if (x < y) return element(y, x);
            else return element(x, y);
        });
    }

    set(x, y, value) {
        super.set(x, y, value);
        if(x != y) {
            super.set(y, x, value);
        }
    }
}

let symmetricMatrix = new SymmetricMatrix(5, (x, y) => `${x},${y}`);
console.log(symmetricMatrix.get(2, 3)); // -> 3, 2

// Instanceof Operator //
/////////////////////////

console.log(new SymmetricMatrix(2) instanceof SymmetricMatrix);
// → true
console.log(new SymmetricMatrix(2) instanceof Matrix);
// → true
console.log(new Matrix(2, 2) instanceof SymmetricMatrix);
// → false
console.log([1] instanceof Array);
// → true