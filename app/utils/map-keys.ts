


type MappedKeysObject<T, Keys extends keyof T> = {
  [K in Keys]: T[K]
}

/**
 * Returns an array of strings mapped over an array of objects containing
 * `id: string` fields.
 */
export function mapKeys<T, Keys extends keyof T>(data: T[], ...keys: Keys[]) {
  return data.map(
    (item) => Object.fromEntries(
      keys.map((key) => [key, item[key]])
    )
  ) as { [Key in Keys]: T[Key] }[]
}
