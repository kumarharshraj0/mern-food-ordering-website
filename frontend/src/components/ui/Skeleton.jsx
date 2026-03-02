export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-300/60 rounded-md ${className}`}
    />
  );
}
