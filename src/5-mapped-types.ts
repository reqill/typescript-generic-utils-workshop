// As mentioned before you can map the type by its index to retrieve the value
// Which looks like this for Arrays
type ArrayType = [string, number, boolean];
type ArrayElement = ArrayType[number];
//   ^?

// And like this for objects
type ObjectType = {
  name: string;
  age?: number;
  isStudent: boolean;
};
type ObjectElement = ObjectType[keyof ObjectType];
//   ^?

// But this is the simplest form of mapped types the more complex form would be create object with dynamic keys
type PlainMappedObject = {
  [Key: string]: string;
};
type MappedObject = {
  [Key in PropertyKey]: string;
}; // Same as Record<PropertyKey, string>

// This come in handy when you would want to recreate object but change the type of the values
type ChangeValues<T, V> = {
  [Key in keyof T]-?: V;
};
type ChangeValuesType = ChangeValues<ObjectType, string>;
//   ^?

// But we can also leverage the power of conditional types to only change the type of one of the values
type ChangeOneValue<T, K extends keyof T, V> = {
  [Key in keyof T]: Key extends K ? V : T[Key];
};
type ChangeOneValueType = ChangeOneValue<ObjectType, "name", number>;
//   ^?
type ChangTwoValuesType = ChangeOneValue<ObjectType, "age" | "name", null>;
//   ^?

// With this notatgion we can easily manipulate optional and readonly type properties

type FooBarObj = {
  foo?: string;
  bar: number;
};

type FooBarRequired = {
  // ^?
  [Key in keyof FooBarObj]-?: FooBarObj[Key]; // remove optional
};

type FooBarOptional = {
  // ^?
  [Key in keyof FooBarObj]?: FooBarObj[Key]; // add optional
};

// You can also make properties readonly and remove readonly in the same manner:
type FooBarReadonly = {
  // ^?
  readonly [Key in keyof FooBarObj]: FooBarObj[Key]; // add readonly
};

type FooBarWritable = {
  // ^?
  -readonly [Key in keyof FooBarReadonly]: FooBarReadonly[Key]; // remove readonly
};

// You can also create mapped types from unions
type UnionType = "foo" | "bar";
type UnionMapped = {
  [Key in UnionType]: string;
};

// You can also rename mapped types
type RenameType = {
  foo: string;
  bar: number;
};

type RenamedType = {
  [Key in keyof RenameType as `new-${Key}`]: RenameType[Key];
};

type RenameTypeWithGetter = {
  [Key in keyof RenameType as `get${Capitalize<
    string & Key
  >}`]: () => RenameType[Key];
};

// You can also remove properties from mapped types
type RenameTypeWithoutFoo = {
  [Key in keyof RenameType as Exclude<Key, "foo">]: RenameType[Key];
};
// but... this is covered by the Omit utility type
type OmittedRenameType = Omit<RenameType, "foo">;
