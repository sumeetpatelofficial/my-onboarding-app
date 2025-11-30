"use client";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-6">Progress</h2>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {Math.round(progress)}% complete
      </p>
    </div>
  );
}
