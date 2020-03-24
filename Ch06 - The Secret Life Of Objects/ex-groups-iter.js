// Groups are actually Sets


class Group {
    constructor() {
        this._gArr = [];
    }

    add(value) {
        if (!this.has(value)) {
            this._gArr.push(value);
        }
    }

    delete(value) {
        this._gArr.filter((e) => e != value);
    }

    has(value) {
        return this._gArr.includes(value);
    }

    static from(iterable) {
        let g = new Group();
        for (let item of iterable) {
            g.add(item);
        }
        return g;
    }

    [Symbol.iterator]() { return new GroupIterator(this);}
}

class GroupIterator {
    constructor(group) {
        this.i = 0;
        this.group = group;
    }

    next() {
        if (this.i >= this.group._gArr.length) {
            return {done: true};
        } else {
            let result = {value: this.group._gArr[this.i],
                          done: false};
            this.i++;
            return result;
        }
    }
}

let g = new Group();

g.add("2");
g.add("2");
g.add("5");

console.log(g);
console.log(g.has(5)); // -> false
console.log(g.has("5")); // -> true

let g2 = Group.from([2, 2, 5, 6, 10]);

console.log(g2);

for (let item of g2) {
    console.log("Item:", item);
}