import clsx from 'clsx';

interface AccountCardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function AccountCard({ children, className, ...rest }: AccountCardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "inline-block p-4 rounded-2xl bg-orange-300 border-none shadow-sm w-1/3 text-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
