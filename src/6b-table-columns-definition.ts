import type { Prettify } from "./utils/prettify";
import type { Equal, Expect } from "./utils/type-check";

/*
  Task 1: 
  Implement a generic type for Columns that would allow us to define columns for a table in type-safe way
  You have three types of columns: text, currency, and image
  Each of the columns properties will be dependent on the key and cell model
  Our goal is to make sure that during writing the columns we can't make mistakes like using a wrong key
  or wrong cell model type for column methods,

  also user can provide its own custom key starting with '$' (dollar sign) 
  which would allow to use the whole data model inside cell

  @example
  type DataModel = {
    user: {
      name: string;
      age: number;
    }
    balance: number;
  } 

  const columns: Column<DataModel>[] = [
    { key: 'user.name', label: 'Name', type: 'text', transform: (value) => value.toUpperCase() }, (here value is string)
    { key: 'balance', label: 'Balance', type: 'currency', currency: 'USD', color: 'green', transform: (value) => value * 2 } (here value is number)
    { key: '$someRandomKey', label: 'Full Data', type: 'text', transform: (value) => `${value.user.name} - ${value.balance}` } (here value is DataModel)
    // error: key 'user.location' doesn't exist in DataModel
    { key: 'user.location', label: 'Location', type: 'text', transform: (value) => value.toUpperCase() }
  ]
*/

type CommonColumnType<Key extends string> = {
  key: Key;
  label: string;
  sortable?: boolean;
};

type SimpleColumnType<Key extends string, CellModel> = Prettify<
  CommonColumnType<Key> & {
    type: "text";
    transform?: (value: CellModel) => string;
  }
>;

type CurrencyColumnType<Key extends string, CellModel> = Prettify<
  CommonColumnType<Key> & {
    type: "currency";
    currency: string | ((value: CellModel) => string);
    color: "red" | "green" | ((value: CellModel) => "red" | "green");
    transform?: (value: CellModel) => number;
  }
>;

type ImageColumnType<Key extends string, CellModel> = Prettify<
  CommonColumnType<Key> & {
    type: "image";
    proportions: `${number}/${number}`;
    transform?: (value: CellModel) => string;
  }
>;

type ColumnType<Key extends string, CellModel> =
  | SimpleColumnType<Key, CellModel>
  | CurrencyColumnType<Key, CellModel>
  | ImageColumnType<Key, CellModel>;

type DotPathType<T, K extends string> = K extends keyof T
  ? T[K]
  : K extends `${infer Start}.${infer Rest}`
  ? DotPathType<T[Extract<Start, keyof T>], Rest>
  : T;

type PossibleDotPaths<T> = {
  [K in keyof T]: K extends string
    ? K | `${K}.${PossibleDotPaths<T[K]>}`
    : never;
}[keyof T];

type Column<
  T extends Record<string, unknown>,
  Key extends PossibleDotPaths<T> = PossibleDotPaths<T>
> =
  | SimpleColumnType<PossibleDotPaths<T>, DotPathType<T, Key>>
  | CurrencyColumnType<PossibleDotPaths<T>, DotPathType<T, Key>>
  | ImageColumnType<PossibleDotPaths<T>, DotPathType<T, Key>>;

/*









*/
// Test cases
type DataModel = {
  user: {
    name: string;
    age: number;
    location?: {
      city: {
        id: string;
        name: string;
      };
    };
  };
  product: {
    name: string;
    price: number;
    image: string;
  };
  newsletter: boolean;
};

const _testColumns: Column<DataModel>[] = [
  {
    key: "",
    type: "text",
  },
];

type A = PossibleDotPaths<DataModel>;
