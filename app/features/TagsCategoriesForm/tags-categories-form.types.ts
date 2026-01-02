import type { Database } from "~/database.types";

export type TagCategoriesProps = {
  tagId: string;
  categories: Database["api"]["Tables"]["categories"]["Row"][] | null | undefined;
}


export type CategoryTagsProps = {
  categoryId: string;
  tags: Database["api"]["Tables"]["tags"]["Row"][] | null | undefined;
}

export type TagsCategoriesPropsUnion = (TagCategoriesProps | CategoryTagsProps) & {
  selected: string[];
};

export type SearchOptionsSource = CategoryTagsProps["tags"] | TagCategoriesProps["categories"];
