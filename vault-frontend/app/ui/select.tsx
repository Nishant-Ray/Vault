import { SelectOption } from '@/app/lib/definitions';
import clsx from 'clsx';

interface InputProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  id: string;
  name: string;
  label: string;
  value: string;
  options: SelectOption[]
  className?: string;
}

export default function Select({ onChange, id, name, value, label, options, className, ...rest }: InputProps) {
  return <div>
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
        return <option key={i} value={option.value} className="">{option.text}</option>;
      }) }
    </select>
  </div>;
}
