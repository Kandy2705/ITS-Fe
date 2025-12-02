import { Link } from "react-router-dom";
import {
  BoxIconLine,
  FolderIcon,
  FileIcon,
  UserIcon,
  PlusIcon,
} from "../../icons";

interface QuickLink {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
  bgColor: string;
}

export default function QuickLinks() {
  const quickLinks: QuickLink[] = [
    {
      title: "Quản lý người dùng",
      description: "Xem và quản lý tất cả người dùng trong hệ thống",
      icon: UserIcon,
      path: "/admin/users",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Quản lý khóa học",
      description: "Xem danh sách và quản lý các khóa học",
      icon: BoxIconLine,
      path: "/admin/courses",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Quản lý lớp học",
      description: "Xem và quản lý các lớp học (course instances)",
      icon: FolderIcon,
      path: "/admin/courses/instances",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Quản lý nội dung",
      description: "Xem và quản lý nội dung học tập",
      icon: FileIcon,
      path: "/admin/content",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Tạo người dùng mới",
      description: "Thêm tài khoản người dùng mới vào hệ thống",
      icon: PlusIcon,
      path: "/admin/users/new",
      color: "text-brand-600",
      bgColor: "bg-brand-50",
    },
    {
      title: "Tạo khóa học mới",
      description: "Tạo khóa học mới trong hệ thống",
      icon: PlusIcon,
      path: "/admin/courses/new",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-card w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white/90">
          Liên kết nhanh
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Truy cập nhanh vào các trang quản lý chính
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <Link
              key={index}
              to={link.path}
              className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-400"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 ${link.bgColor} rounded-lg flex-shrink-0`}
                >
                  <IconComponent className={`${link.color} size-5`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white/90 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {link.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
