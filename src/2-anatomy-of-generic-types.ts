// Generic type always consumes a type argument
type Identity<T> = T;
type ArrayLike<T> = { length: number; [index: number]: T };

type NumberArray = ArrayLike<boolean>;

// The type argument you pass don't have to be passed explicitly - it can be inferred by TypeScript from the value you pass
declare function identity<T>(arg: T): T;
const result = identity(5); // TypeScript infers the type argument as number
//              ^?

const makeArray = <T>(value: T, times: number): T[] =>
  Array.from({ length: times }, () => value);
const arr = makeArray({ a: 1 }, 5); // TypeScript infers the type argument as number
//     ^?

// Typescript provides some built-in generic utilities to work with types
const asyncFunction = async () => 5;

type AsyncReturnType = ReturnType<typeof asyncFunction>;
//   ^?
type AwaitedType = Awaited<AsyncReturnType>;
//   ^?

type ParametersType = Parameters<typeof makeArray>;
//   ^?

type ExampleObject = {
  a: string;
  b?: number;
  c: boolean;
};

type WithoutA = Omit<ExampleObject, "a">;
//   ^?

type OnlyA = Pick<ExampleObject, "a">;
//   ^?

type OptionalExampleObject = Partial<ExampleObject>;
//   ^?

type RequiredExampleObject = Required<ExampleObject>;
//   ^?

type Excluded = Exclude<"a" | "b", "a">;
//   ^?

type Colors = "red" | "green" | "blue";
type CapitalizedColors = Capitalize<Colors>;
//   ^?
type LowercaseColors = Uncapitalize<CapitalizedColors>;
//   ^?
type UpperCaseColors = Uppercase<LowercaseColors>;
//   ^?
type LowerCaseColors = Lowercase<UpperCaseColors>;
//   ^?

// Whole list: https://www.typescriptlang.org/docs/handbook/utility-types.html

// Generic types can also consume multiple type arguments and not everyone has to be provided (optional arguments)
type Tuple<T, U = T> = [T, U]; // U is optional and defaults to T
type StringPair = Tuple<string>;
//   ^?
type MixedPair = Tuple<string, number>;
//   ^?

// You can use any name for you template type argument
type Drawing<Shape, Color = string> = {
  shape: Shape;
  color: Color;
};

const circle: Drawing<"circle"> = {
  shape: "circle",
  color: "red",
};

const invalidCircle: Drawing<"circle"> = {
  // @ts-expect-error
  shape: "square",
  color: "red",
};

// But when creating a variable with a generic type, you have to provide the type argument whereas when creating a function you can omit it and let TypeScript infer it
const drawShape = <Shape, Color>(
  shape: Shape,
  color: Color
): Drawing<Shape, Color> => ({
  shape,
  color,
});

const square1 = drawShape(
  //  ^?
  "square",
  "blue"
);

const square2 = drawShape(
  //  ^?
  "square" as const,
  "blue" as const
);

const square3 = drawShape<number, string>(1, "blue");

const square4 = drawShape(
  //  ^?
  1 as unknown as string,
  "blue"
);

type Params1<Shape, Color> = {
  shape: Shape;
  border?: Color;
  color: Color;
};

const drawShape1 = <Shape, Color>(argObj: Params1<Shape, Color>) => argObj;

const circle1 = drawShape1({
  shape: "circle",
  border: true,
  // @ts-expect-error
  color: "red", // TS thinks it's a boolean because we defined border as boolean first and Color template argument is inferred as boolean
});

// You can avoid this by providing the type argument explicitly, or by changing the order of the template arguments, or marking border type as NoInfer<...>
type Params2<Shape, Color> = {
  shape: Shape;
  border?: NoInfer<Color>;
  color: Color;
};

const drawShape2 = <Shape, Color>(argObj: Params2<Shape, Color>) => argObj;

const circle2 = drawShape2({
  shape: "circle",
  // @ts-expect-error
  border: true,
  color: "red",
});
