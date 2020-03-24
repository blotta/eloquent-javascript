class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    plus(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    }

    minus(v) {
        return new Vec(this.x - v.x, this.y - v.y);
    }
}

let v1 = new Vec(3, 4);
let v2 = new Vec(1, 2);

console.log(v1.length); // -> 5

console.log(v1.plus(v2)); // -> Vec{4, 6}
console.log(v1.minus(v2)); // -> Vec{2, 2}
