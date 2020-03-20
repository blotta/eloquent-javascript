// Define recursive func isEven to the following description:
// * Zero is even
// * One is odd
// * For any other number N, its evenness is the same as N - 2.
//
// Function accepts 1 param (unsigned int); returns bool
//
// Test on 50 and 75

function isEven(n) {
    console.log(n);
    if (n < 0) n = -n;
    
    if (n == 0) {
        return true;
    } else if (n == 1) {
        return false;
    } else {
        return isEven(n - 2);
    }
}

console.log(isEven(50));
console.log(isEven(75));
console.log(isEven(-1));
