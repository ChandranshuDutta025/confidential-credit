// Basic JavaScript Concepts - Learning File
// Standalone example, independent of the main codebase

// Variables (var, let, const)
let name = "Alice";
const PI = 3.14;
var oldVar = "old";

// Functions
function add(a, b) {
  return a + b;
}

// Arrow functions
const multiply = (a, b) => a * b;

// Objects
const user = {
  id: 1,
  name: "Bob",
  email: "bob@example.com"
};

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

// Destructuring
const { name: userName, email } = user;

// Template literals
console.log(`Hello, ${userName}!`);

// Spread operator
const moreNumbers = [...numbers, 6, 7];

// Classes
class Person {
  constructor(public name, public age) {}
  
  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

const person = new Person("Charlie", 25);

// Async/Await
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// Modules (export/import)
export { add, multiply };
export default Person;

console.log("Learning JavaScript complete!");