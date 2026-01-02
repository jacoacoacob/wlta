import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, type ComboboxProps } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "~/utils/cn";

export interface SearchInputOption {
  display: string;
  id: string;
  value: string;
}

export interface SearchInputProps extends ComboboxProps<string | null, false> {
  options: SearchInputOption[];
  /**
   * An array of `SearchInputOption.id`s where each `id` matches one in the `options`
   * array.
   */
  selected: SearchInputOption["id"][];
  /**
   * An array of `SearchInputOption.id`s where each `id` is associated with a pending
   * async operation (i.e. a backend API mutation).
   */
  pendingSelected?: SearchInputOption["id"][]
}

export const SearchInput: React.FC<SearchInputProps> = ({
  options,
  onClose,
  onChange,
  selected,
  pendingSelected = [],
  ...comboboxProps
}) => {
  const [query, setQuery] = useState("");

  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSetSelected = useCallback((value: string | null) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value)
    }
  }, [onChange]);

  const handleSetQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value.toLowerCase());
    },
    [setQuery]
  );

  const handleOnClose = useCallback(() => {
    setQuery("");
    if (onClose) {
      onClose();
    }
  }, []);

  const filteredOptions = useMemo(() =>
    options.filter(
      (option) => option.display.toLowerCase().includes(query)
    ),
    [options, query]
  );

  const inputDisplayValue = useMemo(() => {
    const optionsDict = Object.fromEntries(
      options.map(
        (option) => [option.id, option]
      )
    );

    return selected
      .reduce<string[]>(
        (accum, optionId) => accum.concat(optionsDict[optionId].display),
        []
      )
    },
    [selected]
  );
  
  return (
    <Combobox
      multiple={false}
      onChange={handleSetSelected}
      onClose={handleOnClose}
      value={selectedValue}
      {...comboboxProps}
    >
      <div className="relative">
        <div className="font-bold flex gap-2">
          {selected.map((value) =>
            <div key={value} className="p-1 rounded bg-slate-100 dark:bg-slate-600">
              {value}
            </div>
          )}
          {pendingSelected.map((value) =>
            <div key={value} className="p-1 rounded bg-slate-100 dark:bg-slate-600">
              {value}
            </div>
          )}
        </div>
        <ComboboxInput
          className={cn(
            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
            "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
          )}
          onChange={handleSetQuery}
          displayValue={() => ""}
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
        {filteredOptions.map((option) =>
          <ComboboxOption
            key={option.id}
            value={option.id}
            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
          >
            <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
            <div>{option.display}</div>
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  )
}

/*

# MultiSearchInput

I can 

*/