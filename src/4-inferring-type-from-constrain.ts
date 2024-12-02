// `extends` keyword can not only be used to narrow the type of a generic but also to create a conditional type
// depending on what the passed template type is extending

type IsString<T> = T extends string ? true : false;

type BlueCircleOrOtherRedShape<Shape extends string> = Shape extends "circle"
  ? { color: "blue"; shape: "circle" }
  : { color: "red"; shape: Shape };

type Circle = BlueCircleOrOtherRedShape<"circle">;
//   ^?
type Square = BlueCircleOrOtherRedShape<"square">;
//   ^?

// You can do even some more complex stuff like checking if the passed type is a number disguised as a string
type IsNumber<T> = T extends number
  ? true
  : T extends `${number}`
  ? true
  : false;
type IsNumberTrue = IsNumber<"42">;
//   ^?
type IsNumberTrue2 = IsNumber<42>;
//   ^?
type IsNumberFalse = IsNumber<"foo">;
//   ^?

// Or to check if the string type starts with a certain string
type DoesStartWithFoo<T> = T extends `foo${string}` ? true : false;

// This conditional mechanism also allows us to create a intermidiate derived type if condition is met
type UnshiftString<T extends string> = T extends `${infer _Start}${infer Rest}`
  ? Rest
  : never;
type Unshifted = UnshiftString<"foobar">;
//   ^?

// This way we can also create a type that would retrieve type of the singular element of an array
type ArrayElement<T> = T extends Array<infer U> ? U : never;
type MyArray = { foo: string; bar: number }[];
type ElementType = ArrayElement<MyArray[]>;
//   ^?

// This could lso be achieved by mapping the type but more of that in the next chapter
type ArrayElementMapped = MyArray[number];
//   ^?

// You can also catch the rest of the elements of the array
type ArrayRest<T> = T extends [infer _First, ...infer Rest] ? Rest : never;
type Rest = ArrayRest<[1, 2, 3, 4]>;
//   ^?

// Or catch a string that is between two other strings
type StringBetweenHashes<T extends string> =
  T extends `${string}#${infer Between}#${string}` ? Between : never;
type Between = StringBetweenHashes<"foo#bar#baz">;
//   ^?

// This patter will catch the first match so it can be a gotcha depending on your use case
type BetweenMultiple = StringBetweenHashes<"foo#bar#baz#qux">;
//   ^?

// You can also narrow the type of infered type
type NumberBetweenHashes<T extends string> =
  T extends `${string}#${infer Between extends number}#${string}`
    ? Between
    : never;
type ValidNumber = NumberBetweenHashes<"foo#42#bar">;
//   ^?
type InvalidNumber = NumberBetweenHashes<"foo#bar#baz">;
//   ^?

// Lastly, you can also catch the type of specific part of a function signature
type SecondArgumentOfFunction<T> = T extends (
  first: any,
  second: infer U,
  ...rest: any[]
) => any
  ? U
  : never;

type SecondArg1 = SecondArgumentOfFunction<(a: string, b: number) => void>;
//   ^?
type SecondArg2 = SecondArgumentOfFunction<(a: string, b?: string) => void>;
//   ^?
type SecondArg3 = SecondArgumentOfFunction<(a: string) => void>;
//   ^?
