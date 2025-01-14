import { SelectOption } from '@/app/lib/definitions';
import clsx from 'clsx';

type BaseSelectProps = {
  options: SelectOption[];
  className?: string;
};

type FormSelectProps = BaseSelectProps & {
  value: string;
  label: string;
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSelect?: never;
};

type ChipSelectProps = BaseSelectProps & {
  value?: never;
  label?: never;
  id?: never;
  name?: never;
  onChange?: never;
  onSelect: (value: number) => void;
};

type SelectProps = FormSelectProps | ChipSelectProps;

export default function Select({ options, value, label, id, name, onChange, onSelect, className, ...rest }: SelectProps) {
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
            "border-r-8 mb-5 w-full px-4 py-3 bg-gray-200 text-off_black text-sm font-medium rounded-3xl focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
            className
          )}>
          
          { options.map((option, i) => {
            return <option key={i} value={option.value}>{option.text}</option>;
          }) }
        </select>
      </div>
    );
  }

  const onOptionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSelect) onSelect(Number(event.currentTarget.value));
  };
  
  
  return (
    <div>
      <select
        {...rest}
        onChange={onOptionSelect}
        required
        className={clsx(
          "bg-white border-white border-r-8 px-3 py-1 text-off_black text-md font-normal text-off_gray rounded-full focus:outline-none cursor-pointer ring-1 ring-gray-100 hover:shadow-sm hover:ring-gray-200 transition-all duration-150 ease-in-out",
          className
        )}>
        
        { options.map((option, i) => {
          return <option key={i} value={option.value}>{option.text}</option>;
        }) }
      </select>
    </div>
  );
}
