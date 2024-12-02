// Typescript distinguishes 11 basic types:
// - boolean
// - number
// - string
// - null
// - undefined
// - symbol
// - bigint
// - any
// - unknown
// - void
// - never

// You can use the following syntax to define a variable with one of 8 types:
const isDone: boolean = false;
const decimal: number = 6;
const color: string = "blue";
const options: null = null;
const u: undefined = undefined;
const sym: symbol = Symbol("key");

let big: bigint = 100n;
// @ts-expect-error
big = 2;

let anything: any = "string";
anything = 5;
anything = false;
anything = null;

// You can also omit the type and let TypeScript infer it:
let x = 5;
//  ^?

let y = "text";
//  ^?

const z = "Foo";
//    ^?

// You can also use 3 object types:
// - object
// - array
// - function

const obj: object = {};
const obj2: { key: string } = { key: "value" };
const obj3: Record<string, string> = { key: "value" };
const obj4: { [key: string]: string } = { key: "value", anyKey: "anyValue" };

const arr: number[] = [1, 2, 3];
const arr2: Array<string> = ["a", "b", "c"];

const func: Function = () => {};
const func2: () => void = () => {};
const func3 = (arg: string): number => arg.length;

// You also can create type aliases and interfaces:
interface User {
  name: string;
  age: number;
}

type Name = string;

// ... and use them in your code:

const user: User = { name: "John", age: 30 };
const name: Name = "John";

// You can also use union types:
let union: string | number = "string";
union = 5;

// ... and intersection types:
type Foo = { a: number };
type Bar = { b: string };
type FooBar = Foo & Bar;

const foobar: FooBar = { a: 1, b: "2" };
// @ts-expect-error
const foo: FooBar = { a: 1 };

// With array you can also use tuple types (but in contrast to haskell, they are not implemented as a separate type):
let tuple: [string, number] = ["foo", 5];
// @ts-expect-error
tuple = ["foo", 4, 2];

// Here you can also use enums (but they are not implemented only as a type, but also as a runtime value):
enum Direction1 {
  Up,
  Down,
  Left,
  Right,
}

enum Direction2 {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

const direction: Direction1 = Direction1.Up;
const direction2: Direction2 = Direction2.Up;

// Typescript also provides some handy special types eg.: (more on them later)
type AsyncFunction = (...args: any[]) => Promise<any>;

// Any mix and match of the above types is possible:

type MyComplexObject = {
  id: number;
  name: string;
  email?: string; // optional property
  color: "red" | "green" | "blue";
  isDone: boolean;
  data: {
    key: string;
    value: number;
  }[]; // array of objects
  callback: (arg: string) => void;
};

type CallbackFn = (arg: string) => void;
type PossibleColors = "red" | "green" | "blue";
type Data = {
  key: string;
  value: number;
};

type MyBetterComplexObject = {
  id: number;
  name: string;
  email?: string;
  color: PossibleColors;
  isDone: boolean;
  data: Data[];
  callback: CallbackFn;
};
