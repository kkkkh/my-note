var mime = require("mime");
console.log(mime.getType("/path/to/file.txt"));

// => 'text/plain'
console.log(mime.getType("file.txt"));
// => 'text/plain'
console.log(mime.getType(".TXT"));
// => 'text/plain'
console.log(mime.getType("htm"));
// => 'text/html'

console.log(mime.getExtension("text/plain"));
