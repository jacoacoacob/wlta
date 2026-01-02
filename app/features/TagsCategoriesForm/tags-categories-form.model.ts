import type { KeysOfType } from "~/utils";
import { isCategoryTagsProps, isTagCategoriesProps } from "./tags-categories-form.typeguards";
import type { SearchOptionsSource, TagsCategoriesPropsUnion } from "./tags-categories-form.types";


export function mapSearchOptions<
  Source extends SearchOptionsSource,
  DisplayKey extends KeysOfType<NonNullable<Source>[number], string>,
  ValueKey extends KeysOfType<NonNullable<Source>[number], string>
>(source: Source, displayKey: DisplayKey, valueKey: ValueKey) {
  if (source) {
    return source.map((item) => ({
      id: item.id,
      display: item[displayKey as KeysOfType<typeof item, string>],
      value: item[valueKey as KeysOfType<typeof item, string>]
    }));
  }

  return [];
}

/**
 * 
 * @param props 
 * @returns 
 */
export function deriveSearchOptions(props: TagsCategoriesPropsUnion) {
  if (isTagCategoriesProps(props)) {
    return mapSearchOptions(props.categories, "name", "id");
  }

  if (isCategoryTagsProps(props)) {
    return mapSearchOptions(props.tags, "name", "id");
  }

  console.warn("[TagsCategoriesForm deriveSearchOptions] invalid arguments", props);

  return [];
}
