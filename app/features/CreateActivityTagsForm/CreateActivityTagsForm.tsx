// # Feature
// Start typing a tag name.
// Existing tags whose name matches what has been typed will appear as selectable options.
// Selecting an existing tag will add its `id` to tagIDs array ref accessible to parents via imperativeHandle
// If no tag exists with the typed tag name, an option will appear to "Create new tag"
// Selecting "Create new tag" will call an API to create a new tag.
// If successful, the API will respond with the newly created tag `id` and the compnent will add it to the tagIDs array ref

import { Combobox } from "@headlessui/react"
import { useCallback, useState } from "react"
import { useCachedFetch } from "./_utils";
import { InputField } from "~/patterns";

// # Steps
// [x] Create a tag search API
// [x] Create a tag create API
// [] Set up a combo box component
// [x] Set up a debouncing mechanism
// [x] Set up a caching mechanism

function delay(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export const CreateActivityTagsForm: React.FC = () => {
  const [query, setQuery] = useState("");

  const fetcher = useCallback(async () => {
    await delay(2000);

    return query.toUpperCase();
  }, [query])

  const { data, status } = useCachedFetch(query, fetcher);

  return (
    <div>
      <InputField name="Test" value={query} onChange={(ev) => setQuery(ev.target.value)} />
      <pre>
        {JSON.stringify({ data, status }, null, 2)}
      </pre>
    </div>
  )
}