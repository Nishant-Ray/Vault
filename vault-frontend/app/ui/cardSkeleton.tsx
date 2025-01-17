import clsx from 'clsx';
import { shimmer } from '@/app/lib/constants';

interface CardSkeletonProps {
  isWide?: boolean;
};

export default function CardSkeleton({ isWide = false }: CardSkeletonProps) {
  return (
    <div className={clsx(`${shimmer} relative overflow-hidden rounded-xl flex flex-col gap-4 bg-white p-4 shadow-sm`,
      {
        "col-span-3": isWide,
        "col-span-2": !isWide
      }
    )}>
      <div className="flex gap-4">
        <div className="h-8 w-36 rounded-md bg-gray-100"/>
        <div className="h-8 w-8 rounded-md bg-gray-100"/>
      </div>
      <div className="h-40 rounded-md bg-gray-100"/>
    </div>
  );
}