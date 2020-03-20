function range(start, end, step = 1) {
    result = [];
    step = start > end ? -Math.abs(step) : Math.abs(step);
    for (let n = start; start < end? n <= end : n >= end; n += step) {
        result.push(n);
    }
    return result;
}

function sum(numbers) {
    result = 0;
    for (let num of numbers) {
        result += num;
    }
    return result;
}

console.log(range(1, 10, -2));
console.log(sum(range(1, 10)));

console.log(range(5, 2, 1));