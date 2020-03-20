function reverseArray(array) {
    let newArray = [];
    for (let elem of array) {
        newArray.unshift(elem);
    }
    return newArray;
}

function reverseArrayInPlace(array) {
    for (let i = 0; i < Math.floor(array.length / 2); i++) {
        let aux = array[i];
        array[i] = array[ array.length - 1 - i];
        array[ array.length - 1 - i] = aux;
    }
}

let arr = ["zero", "one", "two", "three", "four", "five", "six"];
console.log(arr);

let newArray = reverseArray(arr);
console.log(newArray);
console.log(newArray == arr); // -> false. Different array

reverseArrayInPlace(arr);
console.log(arr);