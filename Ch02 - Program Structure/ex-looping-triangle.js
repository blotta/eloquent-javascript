for (let i = 0; i < 7; i++) {
    let line = "";
    for (let j = 0; j < i + 1; j++) {
        line += "#";
    }
    console.log(line);
}

let line2 = "";
while (line2.length < 7) {
    line2 += "#";
    console.log(line2);
}