// Use reduce with concat to "flatten" an array of arrays into a single
// array that has all the elements of the original arrays.



let arrayOfArrays = [[1,2,3], ["a", "b", "c"], [{a: true}, {b: false}]];

let newA = arrayOfArrays.reduce( (newArr, arr) => {
    return newArr.concat(arr);
}, []);

console.log(newA);
