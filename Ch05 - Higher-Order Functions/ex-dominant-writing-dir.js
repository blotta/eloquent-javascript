
function characterScript(code) {
    for (let script of SCRIPTS) {
        if (script.ranges.some(([from, to]) => {
            return code >= from && code < to;
        })) {
            return script;
        }
    }
    return null;
}

function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
        let name = groupName(item);
        let known = counts.findIndex(c => c.name == name);
        if (known == -1) {
            counts.push({name, count: 1});
        } else {
            counts[known].count++;
        }
    }
    return counts;
}

// Problem: find the dominant writing direction in a string of text (ltr, rtl, ttb)
//
// characterScript finds the script related to a character
//
// countBy groups a sequence based on the return statement of a function (groupName)
// and adds a count to each group
//
// Solution: given a text, we first group it with countBy and a function that
// finds the script a char belongs to and returns its "direction" property
// (being the groupName). Then reduce the resulting array to find the max count (naivelly).

function domDir(text) {
    let results = countBy(text, (char) => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.direction : "none";
    }).filter((e) => e.name != "none");
    console.log(results);

    // from answer (??)
    if (results.length == 0) return "ltr";
    //
    
    return results.reduce((a, b) => a.count > b.count ? a : b, 0).name;
}

console.log(domDir('英国的狗说 俄罗斯的狗说')); // -> ltr
console.log(domDir("Hey, مساء الخير")); // -> rtl
