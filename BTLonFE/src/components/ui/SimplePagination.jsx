import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Cursor-based pagination — chỉ Previous / Next.
 * Không hỗ trợ "Go to page N" vì cursor không biết vị trí tuyệt đối.
 */
export default function SimplePagination({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  perPage,
  itemCount,
  total,
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Info */}
      <p className="text-sm text-gray-500">
        {itemCount != null && (
          <>
            Showing{" "}
            <span className="font-medium text-gray-700">{itemCount}</span>
            {perPage && (
              <>
                {" "}
                of <span className="font-medium text-gray-700">
                  {perPage}
                </span>{" "}
                per page
              </>
            )}
            {total != null && (
              <>
                {" "}
                &middot;{" "}
                <span className="font-medium text-gray-700">{total}</span> total
              </>
            )}
          </>
        )}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="h-9 px-3 flex items-center gap-1.5 rounded-md text-sm font-medium
            text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="h-9 px-3 flex items-center gap-1.5 rounded-md text-sm font-medium
            text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
