import { useEffect, useState } from "react";
import {
  GroupIcon,
  BoxIconLine,
  FolderIcon,
  UserCircleIcon,
} from "../../icons";
import api from "../../utils/api";
import type { ApiResponse } from "../../interfaces/api";
import type { PageResponse } from "../../interfaces/pagination";
import type { User } from "../../interfaces/user";

interface DashboardStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalAdmins: number;
  totalCourses: number;
  totalCourseInstances: number;
  activeCourseInstances: number;
}

export default function DashboardMetrics() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalCourses: 0,
    totalCourseInstances: 0,
    activeCourseInstances: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users
        const usersRes = await api.get<ApiResponse<PageResponse<User>>>(
          "/users",
          {
            params: { page: 0, size: 1000 },
          }
        );

        if (usersRes.data.success && usersRes.data.data) {
          const users = usersRes.data.data.content || [];
          const totalUsers = usersRes.data.data.totalElements || 0;
          const totalTeachers = users.filter(
            (u) => u.role === "TEACHER"
          ).length;
          const totalStudents = users.filter(
            (u) => u.role === "STUDENT"
          ).length;
          const totalAdmins = users.filter((u) => u.role === "ADMIN").length;

          // Fetch courses
          interface Course {
            id: string;
            title: string;
            code?: string | null;
          }

          const coursesRes = await api.get<ApiResponse<PageResponse<Course>>>(
            "/learning-management/courses",
            {
              params: { page: 0, size: 1000 },
            }
          );

          const totalCourses = coursesRes.data.success
            ? coursesRes.data.data?.totalElements || 0
            : 0;

          // Fetch course instances
          interface CourseInstance {
            id: string;
            course: Course;
            teacher: User;
            status: "ACTIVE" | "INACTIVE";
          }

          const instancesRes = await api.get<
            ApiResponse<PageResponse<CourseInstance>>
          >("/learning-management/courses-instance/getDetailsList", {
            params: { page: 0, size: 1000 },
          });

          const allInstances = instancesRes.data.success
            ? instancesRes.data.data?.content || []
            : [];
          const totalCourseInstances = allInstances.length;
          const activeCourseInstances = allInstances.filter(
            (ci: CourseInstance) => ci.status === "ACTIVE"
          ).length;

          setStats({
            totalUsers,
            totalTeachers,
            totalStudents,
            totalAdmins,
            totalCourses,
            totalCourseInstances,
            activeCourseInstances,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="h-12 w-12 bg-gray-200 rounded-xl mb-5"></div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      icon: GroupIcon,
      label: "Tổng số người dùng",
      value: stats.totalUsers.toLocaleString("vi-VN"),
      description: "Tất cả tài khoản trong hệ thống",
      color: "text-brand-700",
      bgColor: "bg-brand-50",
    },
    {
      icon: UserCircleIcon,
      label: "Số lượng giảng viên",
      value: stats.totalTeachers.toLocaleString("vi-VN"),
      description: "Tài khoản có vai trò giảng viên",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: GroupIcon,
      label: "Số lượng sinh viên",
      value: stats.totalStudents.toLocaleString("vi-VN"),
      description: "Tài khoản có vai trò sinh viên",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: BoxIconLine,
      label: "Tổng khóa học",
      value: stats.totalCourses.toLocaleString("vi-VN"),
      description: "Bao gồm cả lộ trình ITS",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FolderIcon,
      label: "Tổng lớp học",
      value: stats.totalCourseInstances.toLocaleString("vi-VN"),
      description: "Tất cả lớp học (course instances)",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: FolderIcon,
      label: "Lớp học đang hoạt động",
      value: stats.activeCourseInstances.toLocaleString("vi-VN"),
      description: "Lớp học đang mở đăng ký",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-card"
          >
            <div
              className={`flex items-center justify-center w-12 h-12 ${metric.bgColor} rounded-xl dark:bg-gray-800 mb-5`}
            >
              <IconComponent
                className={`${metric.color} size-6 dark:text-white/90`}
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                {metric.label}
              </p>
              <h4
                className={`mt-2 font-bold ${metric.color} text-3xl dark:text-white/90`}
              >
                {metric.value}
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
