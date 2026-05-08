export default function LoadingUI() {
  return (
    <div className="fixed flex w-screen h-screen z-10 top-0 left-0  items-center justify-center bg-white backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        {/* Text */}
        <h2 className="text-lg font-semibold text-gray-800">
          Loading...
        </h2>

        <p className="text-sm text-gray-500">
          Please wait a moment
        </p>
      </div>
    </div>
  );
}