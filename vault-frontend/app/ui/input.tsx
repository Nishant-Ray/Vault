import clsx from 'clsx';
import { HTMLInputTypeAttribute } from 'react';

interface InputProps {
  id: string;
  type: HTMLInputTypeAttribute;
  label: string;
  placeholder?: string;
  className?: string;
}

export default function Input({ id, type, label, placeholder, className, ...rest }: InputProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-off_black pl-2">{label}</label>
      <input
        {...rest}
        type={type}
        id={id}
        placeholder={placeholder}
        required
        className={clsx(
          "shadow-sm bg-gray-200 text-off_black text-sm font-medium rounded-3xl w-full px-4 py-3 focus:outline-none",
          className
        )}
      />
    </div>
  );
}
