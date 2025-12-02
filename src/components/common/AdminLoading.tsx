import type React from "react";

interface AdminLoadingProps {
  message?: string;
  /** Nếu true thì phủ toàn màn hình (overlay), ngược lại là block nội bộ */
  fullScreen?: boolean;
  /** Chiều cao tối thiểu cho block loading nội bộ */
  minHeight?: number | string;
}

const AdminLoading: React.FC<AdminLoadingProps> = ({
  message = "Đang tải dữ liệu...",
  fullScreen = false,
  minHeight = 200,
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm font-medium text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{
        minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default AdminLoading;
