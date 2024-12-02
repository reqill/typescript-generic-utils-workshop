import type { Equal, Expect } from "./utils/type-check";

/*
  Taks 1: Implement own ReturnType<T> generic to get return type of functions
  @example
  type A = MyReturnType<() => string> // expected to be string
*/

type MyReturnType<T> = unknown;

/*
  Task 2: Implement the util type If<C, T, F> which returns T if C is true, and F otherwise
  @example
  type A = If<true, 'a', 'b'> // expected to be 'a'
  type B = If<false, 'a', 'b'> // expected to be 'b'
*/

type If<C, T, F> = unknown;

/*
  Task 3: Implement Includes<T, U> which checks whether the type T contains the type U as true/false
  @example
  type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be false
*/

type Includes<T, U> = unknown;

/*









*/
// Test cases 1
declare function getFoo(): Promise<{ readonly foo?: string }>;
const func = (a: number, b: string) => (Math.random() > 0.5 ? a : b);

type cases1 = [
  Expect<Equal<MyReturnType<() => string>, string>>,
  Expect<Equal<MyReturnType<(a: number) => void>, void>>,
  Expect<
    Equal<
      MyReturnType<() => { a: number; b: string }>,
      { a: number; b: string }
    >
  >,
  Expect<Equal<MyReturnType<() => void>, void>>,
  Expect<Equal<MyReturnType<(a: string, b: number) => string>, string>>,
  Expect<
    Equal<MyReturnType<typeof getFoo>, Promise<{ readonly foo?: string }>>
  >,
  Expect<Equal<MyReturnType<typeof func>, string | number>>
];

// @ts-expect-error
type error1 = MyReturnType<PropertyKey>;

// Test cases 2
type cases2 = [
  Expect<Equal<If<true, "a", "b">, "a">>,
  Expect<Equal<If<false, "a", 2>, 2>>,
  Expect<Equal<If<boolean, "a", 2>, "a" | 2>>
];

// @ts-expect-error
type error2 = If<null, "a", "b">;

// Test cases 3
type cases3 = [
  Expect<
    Equal<Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Kars">, true>
  >,
  Expect<
    Equal<Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Dio">, false>
  >,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 7>, true>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 4>, false>>,
  Expect<Equal<Includes<[1, 2, 3], 2>, true>>,
  Expect<Equal<Includes<[1, 2, 3], 1>, true>>,
  Expect<Equal<Includes<[{}], { a: "A" }>, false>>,
  Expect<Equal<Includes<[boolean, 2, 3, 5, 6, 7], false>, false>>,
  Expect<Equal<Includes<[true, 2, 3, 5, 6, 7], boolean>, false>>,
  Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>>,
  Expect<Equal<Includes<[{ a: "A" }], { readonly a: "A" }>, false>>,
  Expect<Equal<Includes<[{ readonly a: "A" }], { a: "A" }>, false>>,
  Expect<Equal<Includes<[1], 1 | 2>, false>>,
  Expect<Equal<Includes<[1 | 2], 1>, false>>,
  Expect<Equal<Includes<[null], undefined>, false>>,
  Expect<Equal<Includes<[undefined], null>, false>>
];
