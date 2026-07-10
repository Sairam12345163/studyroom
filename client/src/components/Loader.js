const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64 gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          📚
        </div>
      </div>
      <p className="text-purple-600 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;