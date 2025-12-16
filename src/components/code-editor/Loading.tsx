"use client";

export function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <img
        src="https://liveblocks.io/loading.svg"
        alt="Loading"
        className="w-16 h-16 opacity-30 dark:opacity-40"
      />
    </div>
  );
}
