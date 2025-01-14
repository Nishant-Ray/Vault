import clsx from 'clsx';

type WarningProps = {
  isShown: boolean;
  children: string;
}

export default function Warning({ isShown, children }: WarningProps) {
  return <p className={clsx("font-medium text-lg text-negative_text bg-negative text-center rounded-md py-2", { "block mt-6 mb-6": isShown, "hidden": !isShown })}>{children}</p>
}