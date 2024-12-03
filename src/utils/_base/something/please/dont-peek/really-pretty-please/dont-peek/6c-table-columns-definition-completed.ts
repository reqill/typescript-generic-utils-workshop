import type { Equal, Expect } from "../../../../../../type-check";

type DotPathType<
  T,
  Path extends string,
  Undefined = never
> = Path extends `$${string}`
  ? T
  : Path extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? T[First] extends infer D
      ? DotPathType<
          Exclude<D, undefined>,
          Rest,
          D extends undefined ? undefined : Undefined
        >
      : never
    : never
  : Path extends keyof T
  ? T[Path] | Undefined
  : never;

type AllDotPaths<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: K extends string
        ? `${K}` | `${K}.${AllDotPaths<T[K]>}`
        : never;
    }[keyof T]
  : never;

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

type ColumnType<
  Key extends string,
  CellModel,
  SortAttr extends string = never
> = CommonColumnType<Key, SortAttr> &
  (
    | SimpleColumnType<CellModel>
    | CurrencyColumnType<CellModel>
    | ImageColumnType<CellModel>
  );

type Column<
  Data,
  SortAttr extends string = never,
  $Key = AllDotPaths<Data> | `$${string}`
> = $Key extends string
  ? ColumnType<
      $Key,
      $Key extends `$${string}` ? Data : DotPathType<Data, $Key>,
      SortAttr
    >
  : never;

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
    color: (value = 0) => (value > 100 ? "red" : "green"),
    transform: (value = 0) => value * 2,
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
