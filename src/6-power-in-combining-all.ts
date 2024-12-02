import type { Equal, Expect } from "./utils/type-check";

// Okay so one last thign, I promise... We can also use generics recursivelu (obviously with a limit)
// Which comes in handy when we want to parse a string from a pattern, like in the following example:

type CamelCase<T extends string> =
  // Convert everything to lowercase
  Lowercase<T> extends infer S extends string
    ? // Extracts 'foo' and 'bar' from 'foo_bar'
      S extends `${infer Before extends string}_${infer After extends string}`
      ? // Extracts 'b' and 'ar' from 'bar'
        After extends `${infer First extends string}${infer Rest}`
        ? // Checks if the letter next to underscore (here, 'b') isn't an alphabet
          Uppercase<First> extends Lowercase<First>
          ? // If it's not an alphabet, leave the underscore and camelcase the remaining
            `${Before}_${CamelCase<`${First}${Rest}`>}`
          : // If it is an alphabel, remove camelcase, capitalize 'b', and perform camelcasing on the rest
            `${Before}${Uppercase<First>}${CamelCase<Rest>}`
        : S
      : S
    : T;

type cases = [
  Expect<Equal<CamelCase<"foobar">, "foobar">>,
  Expect<Equal<CamelCase<"FOOBAR">, "foobar">>,
  Expect<Equal<CamelCase<"foo_bar">, "fooBar">>,
  Expect<Equal<CamelCase<"foo__bar">, "foo_Bar">>,
  Expect<Equal<CamelCase<"foo_$bar">, "foo_$bar">>,
  Expect<Equal<CamelCase<"foo_bar_">, "fooBar_">>,
  Expect<Equal<CamelCase<"foo_bar_$">, "fooBar_$">>,
  Expect<Equal<CamelCase<"foo_bar_hello_world">, "fooBarHelloWorld">>,
  Expect<Equal<CamelCase<"HELLO_WORLD_WITH_TYPES">, "helloWorldWithTypes">>,
  Expect<Equal<CamelCase<"-">, "-">>,
  Expect<Equal<CamelCase<"">, "">>,
  Expect<Equal<CamelCase<"😎">, "😎">>
];
