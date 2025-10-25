
interface InputProps {
  name: string;
  label?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
}) => {
  return (
    <div className="p-2 border rounded relative flex items-center gap-2">
      {label && (
        <label className="font-mono text-sm" htmlFor={name}>
          {label}
        </label>
      )}
      <input className="flex-1" type={type} name={name} />
    </div>
  )
}