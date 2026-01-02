import type React from "react";
import { Description, Field, Input, Textarea, Label, type FieldProps, type InputProps, type TextareaProps } from '@headlessui/react'
import { memo, useMemo } from "react";
import { SearchInput, type SearchInputProps } from "./SearchInput";

interface InputFieldProps {
  name: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
  ref?: React.Ref<HTMLInputElement>;
}

type InputComponentUnion =
  | {
    _variant: "textarea";
    component: typeof Textarea;
  }
  | {
    _variant: "input";
    component: typeof Input;
  }

type InputComponentPropsUnion =
  | {
    _variant: "textarea";
    props: TextareaProps
  }
  | {
    _variant: "input";
    props: InputProps;
  }


interface BaseFieldProps<Variant extends InputComponentPropsUnion["_variant"]> extends FieldProps {
  _variant: Variant;
  label?: string;
  description?: string;
  InputComponent: Extract<InputComponentUnion, { _variant: Variant }>["component"];
  InputComponentProps: Extract<InputComponentPropsUnion, { _variant: Variant }>["props"];
}

const BaseField: React.FC<BaseFieldProps<InputComponentPropsUnion["_variant"]>> = ({
  _variant,
  label,
  description,
  InputComponent,
  InputComponentProps,
  ...fieldProps
}) => {
  return (
    <Field {...fieldProps}>
      {!!label && (
        <Label className="text-sm/6 font-medium dark:text-white">{label}</Label>
      )}
      {!!description && (
        <Description className="text-sm/6 dark:text-white/50">{description}</Description>
      )}
      <InputComponent
        className={`
          mt-3 px-3 py-1.5 block w-full rounded-lg text-sm/6
          border-none outline outline-slate-400 
          data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-slate-900 
          dark:bg-white/5 dark:data-focus:outline-slate-50 dark:text-white
        `}
        autoComplete="off"
        {...InputComponentProps}
      />
    </Field>
  );
}

interface InputFieldProps extends InputProps {
  label?: string;
  description?: string;
} 

export const InputField = memo<InputFieldProps>(
  ({
    label,
    description,
    ...inputProps
  }) => (
    <BaseField
      _variant="input"
      label={label}
      description={description}
      InputComponent={Input}
      InputComponentProps={inputProps}
    />
  )
);

interface TextareaFieldProps extends TextareaProps {
  label?: string;
  description?: string;
}

export const TextareaField = memo<TextareaFieldProps>(
  ({
    label,
    description,
    ...textareaProps
  }) => (
    <BaseField
      _variant="textarea"
      label={label}
      description={description}
      InputComponent={Textarea}
      InputComponentProps={textareaProps}
    />
  )
);

interface SearchInputFieldProps extends SearchInputProps {
  label?: string;
  description?: string;
}

export const SearchInputField = memo<SearchInputFieldProps>(
  ({
    label,
    description,
    options,
    ...comboboxProps
  }) => (
    <Field>
      {!!label && (
        <Label className="text-sm/6 font-medium dark:text-white">{label}</Label>
      )}
      {!!description && (
        <Description className="text-sm/6 dark:text-white/50">{description}</Description>
      )}
      <SearchInput options={options} {...comboboxProps} />
    </Field>
  )
);
