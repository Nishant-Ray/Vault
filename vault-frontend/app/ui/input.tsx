import clsx from 'clsx';
import { HTMLInputTypeAttribute } from 'react';

interface InputProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  id: string;
  name: string;
  type: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  value?: string;
  checked?: boolean;
  radioLabel?: string;
  standalone?: boolean;
  className?: string;
}

export default function Input({ onChange, id, name, type, value, checked, label, placeholder, radioLabel, standalone = true, className, ...rest }: InputProps) {
  return (
    <div className={clsx({ "mb-5": standalone })}>
      { label && <label htmlFor={id} className="block mb-2 text-lg font-medium text-off_black pl-2">{label}</label> }
      { type === 'radio' ? (
        <label className="font-normal text-off_black flex">
          <input
            {...rest}
            onChange={onChange}
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            required
            checked={checked}
            className={clsx(
              "focus:outline-none mr-2",
              className
            )}
          />
          {radioLabel}
        </label>
      ) : (
        <input
          {...rest}
          onChange={onChange}
          type={type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          required
          className={clsx(
            "w-full px-4 py-3 bg-gray-200 text-off_black text-sm font-medium rounded-3xl focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
            className
          )}
        />
      )}
    </div>
  );
}
