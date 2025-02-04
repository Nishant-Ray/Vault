import { useState, useEffect } from 'react';
import { SelectOption } from '@/app/lib/definitions';
import clsx from 'clsx';

type BaseSelectProps = {
  options: SelectOption[];
  id?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSelect?: (value: number) => void;
  className?: string;
};

type FormSelectProps = BaseSelectProps & {
  label: string;
  value?: string;
  defaultValue?: never;
};

type ChipSelectProps = BaseSelectProps & {
  label?: never;
  value?: number;
  defaultValue?: number;
};

type SelectProps = FormSelectProps | ChipSelectProps;

export default function Select({ options, value, defaultValue, label, id, name, onChange, onSelect, className, ...rest }: SelectProps) {
  if (label) {
    return (
      <div>
        <label htmlFor={id} className="block mb-2 text-lg font-medium text-off_black pl-2">{label}</label>
        <select
          {...rest}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required
          className={clsx(
            "border-r-8 mb-5 w-full px-4 py-3 bg-gray-200 text-off_black text-sm font-medium rounded-full focus:shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
            className
          )}>
          <option value="" disabled>Select an account</option>
          
          { options.map((option) => {
            return <option key={option.value} value={option.value}>{option.text}</option>;
          }) }
        </select>
      </div>
    );
  }

  const onOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSelect) onSelect(Number(event.currentTarget.value));
    if (onChange) onChange(event);
  };
  
  
  return (
    <div>
      <select
        {...rest}
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onOptionSelect}
        required
        className={clsx(
          "bg-white border-white border-r-8 px-3 py-1 text-off_black text-md font-normal text-off_gray rounded-full focus-visible:outline-none cursor-pointer ring-1 ring-gray-200 hover:shadow-sm hover:ring-gray-300 transition-all duration-150 ease-in-out",
          className
        )}>
        
        { options.map((option, i) => {
          return <option key={i} value={option.value}>{option.text}</option>;
        }) }
      </select>
    </div>
  );
}
