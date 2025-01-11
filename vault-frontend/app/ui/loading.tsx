const shimmer = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

function CardSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden rounded-xl flex flex-col gap-4 bg-white p-4 shadow-sm`}>
      <div className="flex gap-4">
        <div className="h-8 w-36 rounded-md bg-gray-100"/>
        <div className="h-8 w-8 rounded-md bg-gray-100"/>
      </div>
      <div className="h-40 rounded-md bg-gray-100"/>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <div className="grid gap-8 grid-cols-2">
        <CardSkeleton/>
        <CardSkeleton/>
        <CardSkeleton/>
        <CardSkeleton/>
      </div>
    </>
  );
}