import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { Database } from "~/database.types";
import { SearchInputField } from "~/patterns";
import { isObject, isString } from "~/utils";
import { cn } from "~/utils/cn";
import type { TagsCategoriesPropsUnion } from "./TagsCategoriesForm/tags-categories-form.types";
import { deriveSearchOptions } from "./TagsCategoriesForm/tags-categories-form.model";
import { isCategoryTagsProps } from "./TagsCategoriesForm/tags-categories-form.typeguards";
import { mapKeys } from "~/utils/map-keys";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Categories } from "~/model/categories";
import type { Tags } from "~/model/tags";
import { TagsCategogies } from "~/model/tags-categories";


type ApiTableRow<Table extends keyof Database["api"]["Tables"]> = Database["api"]["Tables"][Table]["Row"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelData<Query extends (...args: any) => any> = Awaited<ReturnType<Query>>["data"];

interface CategoryTagsFormProps {
  category: NonNullable<ModelData<typeof Categories.getById>>;
  tags: ModelData<typeof Tags.getList> | undefined;
}

/*
  When I uncheck a box, remove that category-tag association

  When I check a box, add that category-tag association

*/

export const CategoryTagsForm: React.FC<CategoryTagsFormProps> = ({
  category,
  tags,
}) => {
  const fetcher = useFetcher({ key: "category-tags-form" });

  const [query, setQuery] = useState("");
  
  const handleSetQuery: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setQuery(event.target.value);
    },
    []
  );

  const [selectedItems, setSelectedItems] = useState(
    mapKeys(category.tags, "id", "name")
  );

  const handleSetSelectedItems = useCallback(
    async (nextItems: typeof selectedItems) => {

      const currentSelectedIDs = selectedItems.map((items) => items.id);
      const nextSelectedIDs = nextItems.map((items) => items.id);
      
      setSelectedItems(nextItems);

      if (currentSelectedIDs.length > nextItems.length) {
        const selectedIDsToRemove = currentSelectedIDs.filter(
          (selectedID) => !nextSelectedIDs.includes(selectedID)
        );

        await Promise.all(
          selectedIDsToRemove.map(
            (selectedID) => fetcher.submit(
              { category_id: category.id, tag_id: selectedID, strategy: "destroy" },
              { action: "/api/tags-categories", method: "post" }
            )
          )
        );
      } else {
        const selectedIDsToAdd = nextSelectedIDs.filter(
          (selectedID) => !currentSelectedIDs.includes(selectedID)
        );

        await Promise.all(
          selectedIDsToAdd.map(
            (selectedID) => fetcher.submit(
              { category_id: category.id, tag_id: selectedID, strategy: "create" },
              { action: "/api/tags-categories", method: "post" }
            )
          )
        );
      }
    },
    [category.id, fetcher, selectedItems]
  );

  const options = useMemo(
    () => {
      const _query = query.toLowerCase();

      return (tags ?? []).filter(
        ({ name }) => name.toLowerCase().includes(_query)
      );
    },
    [query, tags]
  );

  return (
    <Combobox multiple value={selectedItems} onChange={handleSetSelectedItems}>
      <div className="relative">
        <ComboboxInput
          className={cn(
            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
            "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
          )}
          onChange={handleSetQuery}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
        transition
        className={cn(
          "w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible",
          "transition duration-100 ease-in data-leave:data-closed:opacity-0"
        )}
      >
        {options.map((option) =>
          <ComboboxOption
            key={option.id}
            value={option}
            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
          >
            <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
            <div>{option.name}</div>
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  )
}



export const TagsCategoriesForm: React.FC<TagsCategoriesPropsUnion> = (props) => {
  const fetcher = useFetcher({ key: "" });

  const [selected, setSelected] = useState<string>();

  const handleChange = useCallback((newSelected: string | null) => {

  }, []);

  const searchOptions = deriveSearchOptions(props);

  if (isCategoryTagsProps(props)) {
    return (
      <fetcher.Form>
        <input hidden readOnly name="category_id" value={props.categoryId} />
        <SearchInputField
          label="Update tags"
          name="tag_id"
          options={searchOptions}
          onChange={handleChange}
          selected={props.selected}
        />
      </fetcher.Form>
    )
  }

  return (
    <fetcher.Form>
      <input hidden readOnly name="tag_id" value={props.tagId} />
      <SearchInputField
        label="Update tags"
        name="category_id"
        options={searchOptions}
        onChange={handleChange}
        selected={props.selected}
      />
    </fetcher.Form>
  );
}
