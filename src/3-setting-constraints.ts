// You can narrow what type can come inside generic using keywork `extends`

type AllowedKinds = "circle" | "square";
type Drawing<Shape extends AllowedKinds, Color = string> = {
  shape: Shape;
  color: Color;
};

type Circle = Drawing<"circle", "red">;
type Square = Drawing<"square", "blue">;
// @ts-expect-error
type Invalid = Drawing<"triangle", "green">;

// The same applies for functions
declare function drawShape<Shape extends AllowedKinds, Color>(
  shape: Shape,
  color: Color
): Drawing<Shape, Color>;

const circle = drawShape("circle", "red");
const square = drawShape("square", "blue");
// @ts-expect-error
const invalid = drawShape("triangle", "green");

// Some of built-in types are already using this technique eg. Capitalize<...>;
type CapitalizedOne = Capitalize<"hello">;
// @ts-expect-error
type CapitalizedTwo = Capitalize<12>;
//                    ^?

// You can also use `keyof` to narrow the type
declare function returnKeyValue<T, K extends keyof T>(obj: T, key: K): T[K];

const obj = { foo: "bar", baz: 42 };
const value = returnKeyValue(obj, "foo");
// @ts-expect-error
const invalidValue = returnKeyValue(obj, "invalidKey");

// You can also set constraint on optional template type
type FooBar<Foo, Bar extends string = "none"> = {
  a: Foo;
  b: Bar;
};

// If you have a iterable container you can also use spread operator to the new type
type ConcatArray<T extends any[], U extends any[]> = [...T, ...U];
type ConcatArrayTest = ConcatArray<[1, 2], [3, 4]>;
//   ^?
