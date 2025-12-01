import type React from "react";

interface AdminPaginationProps {
  /** current page index (0-based) */
  page: number;
  /** total number of pages */
  totalPages: number;
  /** callback when page changes (0-based) */
  onPageChange: (page: number) => void;
  /** disable all controls (e.g. during loading) */
  disabled?: boolean;
}

const AdminPagination: React.FC<AdminPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const handlePrev = () => {
    if (page <= 0) return;
    onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page >= totalPages - 1) return;
    onPageChange(page + 1);
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-600">
      <span>
        Trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong>
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled || page <= 0}
          onClick={handlePrev}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trang trước
        </button>
        <button
          type="button"
          disabled={disabled || page >= totalPages - 1}
          onClick={handleNext}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
