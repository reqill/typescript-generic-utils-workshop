import type { Prettify } from "./utils/prettify";
import type { Equal, Expect } from "./utils/type-check";

// Okay so one last thign, I promise... We can also use generics recursivelu (obviously with a limit)
// Which comes in handy when we want to parse a string from a pattern, like in the following example:

// input path: '/some/path/{id}/to/{name}' output params: { id: string, name: string }
type GetPathParams<
  T extends string,
  $P extends Record<string, string> = {}
> = Prettify<
  T extends `${infer _Before}/{${infer Key}}/${infer After}`
    ? GetPathParams<`/${After}`, $P & { [K in Key]: string }>
    : T extends `${infer Before}/{${infer Key}}`
    ? GetPathParams<Before, $P & { [K in Key]: string }>
    : $P
>;

type cases1 = [
  Expect<
    Equal<
      GetPathParams<"/some/path/{id}/to/{name}">,
      { id: string; name: string }
    >
  >,
  Expect<Equal<GetPathParams<"/some/path/{id}">, { id: string }>>,
  Expect<
    Equal<
      GetPathParams<"/{some}/{path}/{id}">,
      { some: string; path: string; id: string }
    >
  >,
  Expect<Equal<GetPathParams<"/some/path">, {}>>,
  Expect<Equal<GetPathParams<"">, {}>>
];

// Or even this one:
type Fibonacci<
  T extends number,
  Cur extends number[] = [1],
  Prev extends number[] = [],
  Index extends number[] = [1]
> = Index["length"] extends T
  ? Cur["length"]
  : Fibonacci<T, [...Prev, ...Cur], Cur, [...Index, 1]>;

type cases2 = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>
];
