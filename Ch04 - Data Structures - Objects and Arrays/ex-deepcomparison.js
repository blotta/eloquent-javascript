/*
    My answer
    * Unnecessary to start by checking if it's an object. If it's not, we check
    if values are the same. If it is, then the values are the same anyways, since
    it's pointing to the same object in memory. If both are null, they'll have
    the same values anyway.

    * Missing check in case one of them is null (or typeof is not 'object', for
    some reason). Then we'd return false.

    * Missing key length check

    * Missing if the key can be encountered in both objects

    * result variable makes little sense. Better just to return true on first check
    and return false in case something is not the same. Then have a last return true
    for when we're finished comparing an object and nothing returned false.
*/
function deepEqual(thing1, thing2, indent = 0) {
    let result = true;
    if (typeof thing1 != "object") {
        console.log("Comparing non objects", thing1, thing2);
        return thing1 === thing2;
    } else {
        console.log("Comparing objects", thing1, thing2);
        if (thing1 === null && thing1 === thing2) return true;
        for (let key of Object.keys(thing1)) {
            console.log("Comparing key", key);
            result = deepEqual(thing1[key], thing2[key], indent + 1);
        }
    }
    return result;
}

// actual answer
function deepEqual2(a, b) {
    if (a === b) return true;

    if (a == null || typeof a != "object" || b == null || typeof b != "object") {
            return false;
    }

    let keysA = Object.keys(a), keysB = Object.keys(b);

    if (keysA.length != keysB.length) return false;

    for (let key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!deepEqual2(a[key], b[key])) return false;
    }
    
    return true;
}

let box1 = {
    fruits: {
        apples: 1,
        bananas: 5,
    },
    itsnull: null,
    distributed: false,
}

let box2 = {
    fruits: {
        bananas: 5,
        apples: 1,
    },
    itsnull: null,
    distributed: false,
}

// console.log(Object.keys(box1)); // ["fruits"]
// console.log(typeof box1["fruits"]);
// console.log(typeof box1["distributed"]);
// console.log(Object.keys(box1.fruits)); // -> ["apples", "bananas"]
// console.log(Object.keys(box2.fruits).sort()); // -> ["apples", "bananas"]


console.log(deepEqual2(box1, box2));
