const LoadingSpinner = ({ fullScreen = false }) => {
  const wrapper = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-cream dark:bg-[#0f1419] z-50'
    : 'flex items-center justify-center py-20';

  return (
    <div className={wrapper}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
