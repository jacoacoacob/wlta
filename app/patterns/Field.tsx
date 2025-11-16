import type React from "react";
import { Description, Field, Input, Textarea, Label, type FieldProps, type InputProps, type TextareaProps } from '@headlessui/react'
import { memo } from "react";

interface InputFieldProps {
  name: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
  ref?: React.Ref<HTMLInputElement>;
}

interface BaseFieldProps<Variant extends "input" | "textarea"> extends FieldProps {
  label?: string;
  description?: string;
  InputComponent: Variant extends "textarea" ? typeof Textarea : typeof Input;
  InputComponentProps: Variant extends "textarea" ? TextareaProps : InputProps;
}

const BaseField: React.FC<BaseFieldProps<"input" | "textarea">> = ({
  label,
  description,
  InputComponent,
  InputComponentProps,
  ...fieldProps
}) => (
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
      label={label}
      description={description}
      InputComponent={Textarea}
      InputComponentProps={textareaProps}
    />
  )
);
