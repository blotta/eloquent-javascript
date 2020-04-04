// Replace single quotes with double quotes, while keeping
// contractions like "aren't"
// ' -> "

let text = "'I'm the cook,' he said, 'it's my job.'";
// Answer
console.log(text.replace(/(^|\W)'|'(\W|$)/g, '$1"$2'));
// → "I'm the cook," he said, "it's my job."
