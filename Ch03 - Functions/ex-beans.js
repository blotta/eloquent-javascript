function countChar(s, char) {
    counter = 0;
    for (let i=0; i < s.length; i++) {
        
        if (s[i] == char) counter++;
    }
    return counter;
}

function countBs(s) {
    return countChar(s, "B");
}

console.log(countBs("aaaaBaaaB"));
