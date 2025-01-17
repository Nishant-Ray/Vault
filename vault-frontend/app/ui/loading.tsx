import CardSkeleton from './cardSkeleton';

export default function Loading() {
  return (
    <>
      <div className="grid gap-8 grid-cols-5">
        <CardSkeleton/>
        <CardSkeleton isWide={true}/>
        <CardSkeleton/>
        <CardSkeleton isWide={true}/>
      </div>
    </>
  );
}