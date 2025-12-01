import { Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Fragment, useCallback, useState } from "react";
import { useFetcher } from "react-router";
import type { Database } from "~/database.types";
import { cn } from "~/utils/cn";

type TagCategories = {
  tagId: string;
  categories: Database["api"]["Tables"]["categories"]["Row"][];
}

type CategoryTags = {
  categoryId: string;
  tags: Database["api"]["Tables"]["tags"]["Row"][];
}

type TagsCategoriesPropsUnion = TagCategories | CategoryTags;

export const TagsCategoriesForm: React.FC<TagsCategoriesPropsUnion> = (props) => {
  const fetcher = useFetcher();

  const [selectedRelations, setSelectedRelations] = useState<string[]>([]);

  const handleChange = useCallback((value: string[]) => {
    console.log(value)
  }, []);

  return (
    <fetcher.Form>
      {"categoryId" in props ? (
        <>
          <input hidden readOnly name="categoryId" value={props.categoryId} />
          <Field>
            <Label>Update tags</Label>
            <Listbox multiple by="name" value={selectedRelations} onChange={handleChange}>
              <ListboxButton>
                Hi
                {JSON.stringify(selectedRelations, null)}
              </ListboxButton>
              <ListboxOptions anchor="bottom">
                {props.tags.map((tag) =>
                  <ListboxOption key={tag.id} value={tag} as={Fragment}>
                    {({ focus }) =>
                      <div className={cn("flex gap-2", focus && "bg-blue-100 dark:bg-blue-800")}>
                        &check;
                        {tag.name}
                      </div>
                    }
                  </ListboxOption>
                )}
              </ListboxOptions>
            </Listbox>
          </Field>
        </>
      ) : (
        <>
          <input hidden readOnly name="tag_id" value={props.tagId} />
          <Field>
            <Label>Update categories</Label>
            <Listbox by="name" value={selectedRelations} onChange={setSelectedRelations}>
              <ListboxOptions anchor="bottom">
                {props.categories.map((category) =>
                  <ListboxOption key={category.id} value={category.id} as={Fragment}>
                    {({ focus }) =>
                      <div className={cn("flex gap-2", focus && "bg-blue-100")}>
                        &check;
                        {category.name}
                      </div>
                    }
                  </ListboxOption>
                )}
              </ListboxOptions>
            </Listbox>
          </Field>
        </>
      )}
    </fetcher.Form>
  )
}
