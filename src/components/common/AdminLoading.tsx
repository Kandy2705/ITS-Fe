import { useEffect, useState } from "react";
import { useSidebar } from "../../context/SidebarContext";

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
  const { isExpanded, isHovered } = useSidebar();
  const [sidebarWidth, setSidebarWidth] = useState(0);

  useEffect(() => {
    // Tính toán sidebar width dựa trên state và screen size
    const calculateSidebarWidth = () => {
      if (typeof window === "undefined") return 0;
      if (window.innerWidth < 1024) return 0; // Mobile: sidebar overlay
      return isExpanded || isHovered ? 290 : 90; // Desktop: sidebar width
    };

    setSidebarWidth(calculateSidebarWidth());

    // Lắng nghe resize để cập nhật khi window size thay đổi
    const handleResize = () => {
      setSidebarWidth(calculateSidebarWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded, isHovered]);

  if (fullScreen) {
    // Tính toán vị trí để chỉ phủ phần content area (không phủ sidebar và header)
    // Header height: ~64px (sticky top-0)
    // Sidebar width: 290px khi expanded/hovered, 90px khi collapsed (trên desktop)
    const headerHeight = 64;

    return (
      <div
        className="fixed z-[9998] flex items-center justify-center bg-black/30 backdrop-blur-sm"
        style={{
          top: `${headerHeight}px`,
          left: `${sidebarWidth}px`,
          right: "0",
          bottom: "0",
        }}
      >
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
