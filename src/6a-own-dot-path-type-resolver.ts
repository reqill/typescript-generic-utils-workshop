import type { Equal, Expect } from "./utils/type-check";

/*
  Task 1: Implement own dot path object type resolver. Similar to lodash's get method
  @example
  type Data = {
    user: {
      name: 'Tosin',
      age: 24,
      location: {
        country: 'Nigeria',
        continent: 'Africa'
      }
    }
  };
  type name = DotPathType<data, 'user.name'>; // Tosin
*/

type DotPathType<T, P> = unknown;

/*
  Task 2: Implement own type that would gather in union all possible paths in the input object
  @example
  type Data = {
    user: {
      name: 'Tosin',
      age: 24,
      location: {
        country: 'Nigeria',
        continent: 'Africa'
      }
    }
  };
  type paths = DotPaths<Data>; // 'user.name' | 'user.age' | 'user.location.country' | 'user.location.continent' | 'user' | 'user.location'
*/

export type AllDotPaths<T> = unknown;

/* 
  Task 3:
  Implement DotPathType but with inclusion of possible undefined types 
  as well as handling any joker key starting with '$' that should 
  return the whole data model
  @example
  type Data = {
    user: {
      name: 'Tosin',
      age: 24,
      location?: {
        country: 'Nigeria',
        continent: 'Africa'
      }
    }
  };
  type name = GetTypeAtPath<Data, 'user.name'>; // Tosin
  type location = GetTypeAtPath<Data, 'user.location'>; // { country: 'Nigeria', continent: 'Africa' } | undefined
  type country = GetTypeAtPath<Data, 'user.location.country'>; // 'Nigeria' | undefined
  type joker = GetTypeAtPath<Data, '$whatever'>; // Data
*/

export type DotPathTypeWithUndefined<T, P> = unknown;

/*










*/
// Test cases 1
type Data = {
  foo: {
    bar: {
      value: "foobar";
      count: 6;
    };
    included: true;
  };
  "foo.baz": false;
  hello: "world";
  "2": "two";
};

type cases1 = [
  Expect<Equal<DotPathType<Data, "hello">, "world">>,
  Expect<Equal<DotPathType<Data, "foo.bar.count">, 6>>,
  Expect<Equal<DotPathType<Data, "foo.bar">, { value: "foobar"; count: 6 }>>,
  Expect<Equal<DotPathType<Data, "foo.baz">, false>>,
  Expect<Equal<DotPathType<Data, "no.existed">, never>>,
  Expect<Equal<DotPathType<Data, "2">, "two">>
];

// Test cases 2

type cases2 = [
  Expect<
    Equal<
      AllDotPaths<Data>,
      | "foo.bar.value"
      | "foo.bar.count"
      | "foo.included"
      | "foo.baz"
      | "hello"
      | "foo"
      | "foo.bar"
      | "2"
    >
  >
];

// Test cases 3

type DataWithUndefined = {
  foo: {
    bar?: {
      value: "foobar";
      count: 6;
    };
    included: true;
    optional?: string;
  };
  "foo.baz": false;
  hello: "world";
  "2": "two";
  biz: {
    baz: {
      value: "bizbaz";
      count: 6;
    };
  };
};

type cases3 = [
  Expect<Equal<GetTypeAtPath<DotPathTypeWithUndefined, "hello">, "world">>,
  Expect<
    Equal<
      GetTypeAtPath<DotPathTypeWithUndefined, "foo.bar.count">,
      6 | undefined
    >
  >,
  Expect<
    Equal<
      GetTypeAtPath<DotPathTypeWithUndefined, "foo.bar">,
      { value: "foobar"; count: 6 } | undefined
    >
  >,
  Expect<
    Equal<
      GetTypeAtPath<DotPathTypeWithUndefined, "foo.bar.value">,
      "foobar" | undefined
    >
  >,
  Expect<
    Equal<
      GetTypeAtPath<DotPathTypeWithUndefined, "foo.optional">,
      string | undefined
    >
  >,
  Expect<
    Equal<GetTypeAtPath<DotPathTypeWithUndefined, "biz.baz.value">, "bizbaz">
  >
];
