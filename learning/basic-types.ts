// Basic TypeScript Types - Learning File
// This is a standalone learning example, independent of the main codebase

// Primitive types
let id: number = 123;
let name: string = "Alice";
let isActive: boolean = true;

// Array types
let userIds: number[] = [1, 2, 3];
let usernames: Array<string> = ["alice", "bob"];

// Object type
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// Function type
function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

// Generic type
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42);
const text = identity("hello");

// Enum
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

// Union type
function printId(id: number | string): void {
  console.log(`ID: ${id}`);
}

// Never type
function error(message: string): never {
  throw new Error(message);
}

// Type assertion
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Literal types
const direction: "UP" | "DOWN" | "LEFT" | "RIGHT" = "UP";

console.log("Learning types complete!");