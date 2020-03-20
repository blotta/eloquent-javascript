function arrayToList(array) {
    let list = null;
    for (let i = array.length - 1; i >= 0; i--) {
        // list = { value: array[i], rest: list};
        list = prepend(array[i], list);
    }
    return list;
}

function listToArray(list) {
    let array = [list.value];
    let rest = list.rest;
    while (rest != null) {
        array.push(rest.value);
        rest = rest.rest;
    }
    return array
}

function prepend(value, list) {
    return {value: value, rest: list};
}

function nth(list, n) {
    if (list == null) {
        return undefined;
    } else if (n == 0) {
        return list.value;
    } else {
        return nth(list.rest, n - 1)
    }
}

let arr = [1, 2, 3, 5, 4];
let list = arrayToList(arr);
console.log(list);
console.log(listToArray(list));
console.log(nth(list, 5)); // -> 5
