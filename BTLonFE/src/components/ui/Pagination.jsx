function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
}

function PageButton({ page, current, onClick }) {
  const isActive = page === current;

  return (
    <button
      onClick={() => onClick(page)}
      aria-current={isActive ? "page" : undefined}
      className={[
        "h-9 min-w-[2.25rem] px-3 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-blue-600 text-white pointer-events-none"
          : "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
      ].join(" ")}
    >
      {page}
    </button>
  );
}

function Ellipsis() {
  return (
    <span className="h-9 min-w-[2.25rem] px-1 flex items-center justify-center text-gray-400 select-none">
      &hellip;
    </span>
  );
}

function NavButton({ onClick, disabled, label, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="h-9 w-9 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

// Pagination

export default function Pagination({
  current,
  total,
  onPageChange,
  perPage,
  totalItems,
  showInfo = true,
}) {
  if (total <= 1) return null;

  const pages = buildPages(current, total);

  const from = perPage && totalItems ? (current - 1) * perPage + 1 : null;
  const to =
    perPage && totalItems ? Math.min(current * perPage, totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      {showInfo && (
        <p className="text-sm text-gray-500 shrink-0">
          {from && to && totalItems ? (
            <>
              Display{" "}
              <span className="font-medium text-gray-700">
                {from}-{to}
              </span>{" "}
              / <span className="font-medium text-gray-700">{totalItems}</span>{" "}
              result
            </>
          ) : (
            <>
              Page <span className="font-medium text-gray-700">{current}</span>{" "}
              / <span className="font-medium text-gray-700">{total}</span>
            </>
          )}
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <NavButton
          label={"First page"}
          disabled={current === 1}
          onClick={() => onPageChange(1)}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0zM9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </NavButton>

        {/* Prev */}
        <NavButton
          label="Previous page"
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </NavButton>

        {/* Page numbers */}
        {pages.map((page, i) =>
          page === "..." ? (
            <Ellipsis key={`ellipis-${i}`} />
          ) : (
            <PageButton
              key={page}
              page={page}
              current={current}
              onClick={onPageChange}
            />
          ),
        )}
        {/* Next */}
        <NavButton
          label="Next page"
          disabled={current === total}
          onClick={() => onPageChange(current + 1)}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </NavButton>

        {/* Last */}
        <NavButton
          label="Last page"
          disabled={current === total}
          onClick={() => onPageChange(total)}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zM10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </NavButton>
      </div>
    </div>
  );
}
