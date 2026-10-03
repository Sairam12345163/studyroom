const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64 gap-3">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  );
};

export default Loader;