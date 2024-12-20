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

type CommonColumnType<Key extends string, SortAttr extends string = never> = {
  key: Key;
  label: string;
  sortAttr?: SortAttr;
};

type SimpleColumnType<CellModel> = {
  type: "text";
  transform?: (value: CellModel) => string;
};

type CurrencyColumnType<CellModel> = {
  type: "currency";
  currency: string | ((value: CellModel) => string);
  color: "red" | "green" | ((value: CellModel) => "red" | "green");
  transform?: (value: CellModel) => number;
};

type ImageColumnType<CellModel> = {
  type: "image";
  proportions: `${number}/${number}`;
  transform?: (value: CellModel) => string;
};

type Column<Data, SortAttr> = unknown;

/*









*/
// Test cases
type DataModel = {
  user: {
    name: string;
    age: number;
    location: {
      city: {
        id: string;
        name: string;
      };
    };
  };
  product?: {
    name: string;
    price: number;
    image: string;
  };
  newsletter: boolean;
};

type SortAttributes = "userName" | "cityName" | "subscribed";

const _testColumns1 = [
  {
    key: "newsletter",
    type: "text",
    label: "Newsletter",
    // @ts-expect-error
    sortAttr: "das",
  },
  {
    key: "$arbitraryKey",
    type: "text",
    label: "Name",
    transform: (value) => value.user.name,
  },
  {
    key: "product.price",
    type: "currency",
    color: (value) => (value > 100 ? "red" : "green"),
    transform: (value) => value * 2,
    currency: "EUR",
    label: "City ID",
    sortAttr: "subscribed",
  },
  {
    key: "user.location.city.name",
    type: "image",
    proportions: "16/9",
    label: "City Image",
    transform: (value) => value,
  },
] as const satisfies Column<DataModel, SortAttributes>[];

type cases = [
  Expect<
    Equal<Parameters<(typeof _testColumns1)[1]["transform"]>[0], DataModel>
  >,
  Expect<
    Equal<
      Parameters<(typeof _testColumns1)[2]["transform"]>[0],
      number | undefined
    >
  >,
  Expect<Equal<Parameters<(typeof _testColumns1)[3]["transform"]>[0], string>>
];
