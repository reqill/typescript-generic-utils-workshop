import type { Equal, Expect } from "./utils/type-check";

/*
  Taks 1: Implement MyPick which extracts properties by key from source type
  @example
  type NewType = MyPick<{ name: string; age: number }, "name">; // { name: string }
*/

type MyPick<T, K> = unknown;

/*
  Taks 2: Implement the type version of Object.entries
  @example
  type Model = {
    name: string;
    age: number;
    locations: string[] | null;
  }
  type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
*/

type ObjectEntries<T> = unknown;

/*
  Taks 3: Implement TupleToReadonlyObject which converts tuple to readonly object
  @example
  type Tuple = ['a', 'b', 'c'] as const;
  type Result = TupleToReadonlyObject<Tuple>; // { readonly a: 'a', readonly b: 'b', readonly c: 'c' }
*/

type TupleToReadonlyObject<T> = unknown;

/*













*/
// Test cases 1
type cases1 = [
  Expect<
    Equal<MyPick<{ name: string; age: number }, "name">, { name: string }>
  >,
  Expect<
    Equal<MyPick<{ name: string; age?: number }, "age">, { age?: number }>
  >,
  Expect<
    Equal<
      MyPick<{ readonly name: string; age: number }, "name" | "age">,
      { readonly name: string; age: number }
    >
  >
];

// @ts-expect-error
type error1 = MyPick<{ name: string; age: number }, "otherKey">;

// Test cases 2
type Model2 = {
  name: string;
  age: number;
  locations: string[] | null;
};

type ModelEntries =
  | ["name", string]
  | ["age", number]
  | ["locations", string[] | null];

type cases2 = [
  Expect<Equal<ObjectEntries<Model2>, ModelEntries>>,
  Expect<Equal<ObjectEntries<Partial<Model2>>, ModelEntries>>,
  Expect<Equal<ObjectEntries<{ key?: undefined }>, ["key", undefined]>>,
  Expect<Equal<ObjectEntries<{ key: undefined }>, ["key", undefined]>>,
  Expect<
    Equal<
      ObjectEntries<{ key: string | undefined }>,
      ["key", string | undefined]
    >
  >
];

// Test cases 3

const tuple = ["tesla", "model 3", "model X", "model Y"] as const;
const tupleNumber = [1, 2, 3, 4] as const;
const sym1 = Symbol(1);
const sym2 = Symbol(2);
const tupleSymbol = [sym1, sym2] as const;
const tupleMix = [1, "2", 3, "4", sym1] as const;

type cases3 = [
  Expect<
    Equal<
      TupleToReadonlyObject<typeof tuple>,
      {
        readonly tesla: "tesla";
        readonly "model 3": "model 3";
        readonly "model X": "model X";
        readonly "model Y": "model Y";
      }
    >
  >,
  Expect<
    Equal<
      TupleToReadonlyObject<typeof tupleNumber>,
      { readonly 1: 1; readonly 2: 2; readonly 3: 3; readonly 4: 4 }
    >
  >,
  Expect<
    Equal<
      TupleToReadonlyObject<typeof tupleSymbol>,
      { readonly [sym1]: typeof sym1; readonly [sym2]: typeof sym2 }
    >
  >,
  Expect<
    Equal<
      TupleToReadonlyObject<typeof tupleMix>,
      {
        readonly 1: 1;
        readonly "2": "2";
        readonly 3: 3;
        readonly "4": "4";
        readonly [sym1]: typeof sym1;
      }
    >
  >
];

// @ts-expect-error
type error3 = TupleToReadonlyObject<[[1, 2], {}]>;
