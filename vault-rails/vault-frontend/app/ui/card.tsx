import clsx from 'clsx';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "inline-block bg-white rounded-xl p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
