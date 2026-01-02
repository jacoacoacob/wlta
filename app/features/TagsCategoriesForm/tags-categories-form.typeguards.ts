import { isObject, isString } from "~/utils";
import type { CategoryTagsProps, TagCategoriesProps } from "./tags-categories-form.types";

export function isTagCategoriesProps(data: unknown): data is TagCategoriesProps {
  return isObject(data) && isString(data.tagId) && "categories" in data;
}

export function isCategoryTagsProps(data: unknown): data is CategoryTagsProps {
  return isObject(data) && isString(data.categoryId) && "tags" in data;
}
