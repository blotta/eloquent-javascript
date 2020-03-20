var converter = new showdown.Converter();
var text = '# Hello, markdown!';
var html = converter.makeHtml(text);
console.log(html);


console.log("Hello World again");

let caught = 5 * 5;
console.log(caught);

let mood = "light";
console.log(mood);
mood = "dark";
console.log(mood);

var name = "Ayda"; // pre-2015 JS
const greeting = "Hello ";


// prompt("Enter passcode");

let theNumber = prompt("Pick a number");
console.log(theNumber);
if (!Number.isNaN(Number(theNumber))) {
    let num = Number(theNumber);
    console.log("Your number is the square root of " + num * num);
} else if ( theNumber == "five" ) {
    console.log("write 5, not 'five'");
} else {
    console.log("Need a number, sir!");
}

let number = 0;
while (number <= 12) {
    console.log(number);
    number = number + 2;
}

let yourName;
do {
    yourName = prompt("Who are you?");
} while (!yourName);
console.log(yourName);

console.log("" == false); // true

for (let n = 0; n <= 12; n = n + 2) {
    console.log(n);
    
}

switch (prompt("Whai is the wather like?")) {
    case "rainy":
        console.log("Remember to bring an umbrella");
        break;
    case "sunny":
        console.log("Dress lightly");
        break;
    case "cloudy":
        console.log("Go outside");
        break;
    default:
        console.log("Unknown weather type");
        break;
}
