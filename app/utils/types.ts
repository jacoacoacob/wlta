
/**
 * Extract keys from type `O` whose values are of type `V`
 * 
 * ```ts
 * interface MyObject {
 *  a: string;
 *  b: number;
 *  c: boolean;
 * }
 * 
 * KeysOfType<MyObject, string>; // "a"
 * KeysOfType<MyObject, number>; // "b"
 * KeysOfType<MyObject, number | boolean>; // "b" | "c"
 * ```
 */
export type KeysOfType<O, V> = { 
    [K in keyof O]: O[K] extends V ? K : never 
}[keyof O];

