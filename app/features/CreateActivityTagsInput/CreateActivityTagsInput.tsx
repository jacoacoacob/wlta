// # Feature
// Start typing a tag name.
// Existing tags whose name matches what has been typed will appear as selectable options.
// Selecting an existing tag will add its `id` to tagIDs array ref accessible to parents via imperativeHandle
// If no tag exists with the typed tag name, an option will appear to "Create new tag"
// Selecting "Create new tag" will call an API to create a new tag.
// If successful, the API will respond with the newly created tag `id` and the compnent will add it to the tagIDs array ref

import { Button, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Input } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useCallback, useMemo, useState } from "react"
import { useFetcher } from "react-router";
import type { ApiTableRow } from "~/model/_utils";

import type { TagsService } from "~/services";
import { useCachedFetcher } from "~/utils";
import { cn } from "~/utils";

// # Steps
// [x] Create a tag search API
// [x] Create a tag create API
// [x] Set up a combo box component
// [x] Set up a debouncing mechanism
// [x] Set up a caching mechanism

type TagsSearchResult = Awaited<ReturnType<InstanceType<typeof TagsService>["searchTags"]>>;

type Tag = ApiTableRow<"tags">;

export const CreateActivityTagsInput: React.FC = () => {
  const [query, setQuery] = useState("");

  const url = useMemo(() => `/api/tags/search?name=${encodeURIComponent(query)}`, [query])

  const { data: comboboxOptions, status } = useCachedFetcher<TagsSearchResult>(url);

  const newTagFetcher = useFetcher();

  const createNewTag = useCallback(() => {
    newTagFetcher.submit(
      { name: query },
      { action: "/api/tags/create", method: "post" },
    );
  }, [newTagFetcher, query]);

  const hasNoMatchingOptions = (
    (comboboxOptions?.tags ?? []).length === 0 &&
    status === "idle" &&
    query.trim().length > 0
  );

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  return (
    <div>
      <Input hidden readOnly name="tags" value={selectedTags.map((tag) => tag.id)} />
      <Combobox
        multiple
        value={selectedTags}
        onChange={(tagIDs) => { setSelectedTags(tagIDs) }}
        onClose={() => { setQuery("") }}
      >
        <div className="flex gap-2 p-2">
          {selectedTags.map((tag) =>
            <div key={tag.id} className="py-1 px-2 border rounded-sm text-sm font-mono flex items-center gap-1">
              <Button
                className="size-4 mr-1"
                onClick={() => {
                  setSelectedTags(selectedTags.filter((_tag) => tag.id !== _tag.id))
                }}
              >
                <XMarkIcon className="fill-slate-600 hover:fill-slate-800 dark:fill-slate-400 dark:hover:fill-white" />
              </Button>
              <span>
                {tag.name}
              </span>
            </div>
          )}
        </div>
        <div className="relative">
          <ComboboxInput
            onChange={(ev) => setQuery(ev.target.value)}
            className={cn(
              'w-full rounded-lg border-none dark:bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 dark:text-white',
              'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
            )}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 dark:fill-white/60 dark:group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

       <ComboboxOptions
          anchor="bottom"
          transition
          className={cn(
            'w-(--input-width) rounded-xl border dark:border-white/5 dark:bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
            'transition duration-100 ease-in data-leave:data-closed:opacity-0'
          )}
        >
          {comboboxOptions?.tags?.map((tag) =>
            <ComboboxOption
              key={tag.id}
              value={tag}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 dark:fill-white group-data-selected:visible" />
              <div className="text-sm/6 dark:text-white font-mono">{tag.name}</div>
            </ComboboxOption>
          )}

          {hasNoMatchingOptions && (
            <Button
              onClick={createNewTag} 
              className="flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
            >
              <span>create new tag:</span>  {query}
            </Button>
          )}
        </ComboboxOptions>

      </Combobox>
      
    </div>
  )
}