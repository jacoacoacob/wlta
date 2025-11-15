import type React from "react";

interface InputProps {
  name: string;
  label?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
  ref?: React.Ref<HTMLInputElement>;
  value?: HTMLInputElement["value"]
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  ref,
  value
}) => {
  return (
    <div className="p-2 border rounded relative flex items-center gap-2">
      {label && (
        <label className="font-mono text-sm" htmlFor={name}>
          {label}
        </label>
      )}
      <input value={value} ref={ref} className="flex-1" type={type} name={name} />
    </div>
  )
}