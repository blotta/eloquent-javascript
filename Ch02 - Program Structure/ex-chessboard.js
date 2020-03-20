size = 8;

for (let col = 0; col < size; col++) {
    let patt = col % 2 == 1 ? "# " : " #";
    let line = "";
    for (let row = 0; row < size; row += patt.length) {
        line += patt;
    }
    console.log(line);
}