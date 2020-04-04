let r1 = /ca[tr]/;
let r2 = /pr?op/;
let r3 = /ferr(et|y|ari)/;
let r4 = /ious\b/;
let r5 = /\s[.,:;]/;
let r6 = /\b\w{7,}\b/;
let r7 = /\b[^\We]+\b/i;

function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes)
    if (!regexp.test(str)) {
      console.log(`Failure to match '${str}'`);
    }
  for (let str of no)
    if (regexp.test(str)) {
      console.log(`Unexpected match for '${str}'`);
    }
}

verify(r1, ["my car", "bad cats"], ["camper", "high art"]);

verify(r2, ["pop culture", "mad props"], ["plop", "prrrop"]);

verify(r3, ["ferret", "ferry", "ferrari"], ["ferrum", "transfer A"]);

verify(r4, ["how delicious", "spacious room"], ["ruinous", "consciousness"]);

verify(r5, ["bad punctuation ."], ["escape the period"]);

verify(r6, ["hottentottententen"], ["no", "hotten totten tenten"]);

verify(
  r7,
  ["red platypus", "wobbling nest"],
  ["earth bed", "learning ape", "BEET"]
);
