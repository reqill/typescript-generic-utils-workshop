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

type DotPathType<T, K extends string> = unknown;

/*












*/
// Test cases
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
};

type cases = [
  Expect<Equal<DotPathType<Data, "hello">, "world">>,
  Expect<Equal<DotPathType<Data, "foo.bar.count">, 6>>,
  Expect<Equal<DotPathType<Data, "foo.bar">, { value: "foobar"; count: 6 }>>,
  Expect<Equal<DotPathType<Data, "foo.baz">, false>>,

  Expect<Equal<DotPathType<Data, "no.existed">, never>>
];
