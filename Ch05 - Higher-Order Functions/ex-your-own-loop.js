

function loop(value, test, update, body) {
    // let failSafeCount = 0, maxFailCount = 100;
    while (test(value)) {
        console.log("starting with", value);
        body(value);
        value = update(value);

        // if (failSafeCount < maxFailCount) {
        //     failSafeCount++
        // } else {
        //     console.log("FAIL");
        //     break;
        // }
    }
}

for (let i = 0; i < 10; i++) {
    // body
    console.log(i);
}

loop(0, (a) => a < 10, (i) => ++i, (v) => console.log(v));