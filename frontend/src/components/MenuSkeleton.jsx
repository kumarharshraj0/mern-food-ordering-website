const MenuSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-2xl overflow-hidden shadow">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
};

export default MenuSkeleton;

