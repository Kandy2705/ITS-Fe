import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import api from "../../utils/api";
import AdminLoading from "../../components/common/AdminLoading";
import AdminPagination from "../../components/common/AdminPagination";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import type { ApiResponse } from "../../interfaces/api";
import type { PageResponse } from "../../interfaces/pagination";
import type { User } from "../../interfaces/user";

const PAGE_SIZE = 6; // 6 courses per page for grid layout

type SortOption = "code-asc" | "code-desc" | "title-asc" | "title-desc";

type CourseInstanceStatus = "ACTIVE" | "INACTIVE";

interface Course {
  id: string;
  title: string;
  code: string | null;
  description: string | null;
  credit: string | null;
  status: string;
}

interface CourseInstance {
  id: string;
  course: Course;
  teacher: User;
  status: CourseInstanceStatus;
}

interface CourseDisplay {
  id: string;
  courseCode: string;
  title: string;
  instructor: string;
  progress: number;
  credits: number;
  status: CourseInstanceStatus;
}

const StudentCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageData, setPageData] = useState<PageResponse<CourseInstance> | null>(
    null
  );

  // Fetch current user info to get student ID
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<User>>("/users/me");
      if (res.data.success && res.data.data) {
        setStudentId(res.data.data.id);
      } else {
        setError("Không thể lấy thông tin người dùng");
        setLoading(false);
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi lấy thông tin người dùng";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  // Fetch course instances for the student
  const fetchCourseInstances = useCallback(
    async (page: number = 0) => {
      if (!studentId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await api.get<ApiResponse<PageResponse<CourseInstance>>>(
          "/learning-management/courses-instance/getDetailsList",
          {
            params: {
              studentId: studentId,
              page: page,
              size: PAGE_SIZE,
            },
          }
        );

        if (res.data.success && res.data.data) {
          const pageResponse = res.data.data;
          const instances = pageResponse.content || [];

          // Map API response to display format
          const mappedCourses: CourseDisplay[] = instances.map((instance) => ({
            id: instance.id,
            courseCode: instance.course.code || "N/A",
            title: instance.course.title,
            instructor: `${instance.teacher.firstName} ${instance.teacher.lastName}`,
            progress: 0, // TODO: Calculate actual progress from student data
            credits: parseInt(instance.course.credit || "0", 10) || 0,
            status: instance.status,
          }));

          setCourses(mappedCourses);
          setPageData(pageResponse);
          setCurrentPage(page);
        } else {
          setError(res.data.message || "Không thể tải danh sách khóa học");
        }
      } catch (err: unknown) {
        let errorMessage = "Đã xảy ra lỗi khi tải danh sách khóa học";
        if (axios.isAxiosError(err)) {
          if (err.response?.data && typeof err.response.data === "object") {
            const data = err.response.data as { message?: string };
            errorMessage = data.message || err.message || errorMessage;
          } else {
            errorMessage = err.message || errorMessage;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [studentId]
  );

  // Fetch current user on mount
  useEffect(() => {
    void fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Fetch course instances when studentId is available
  useEffect(() => {
    if (studentId) {
      void fetchCourseInstances(0);
    }
  }, [studentId, fetchCourseInstances]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (studentId) {
      void fetchCourseInstances(page);
    }
  };

  // Note: Filtering and sorting is now done on the client side for the current page
  // If you want server-side filtering/sorting, you'll need to pass these as API params
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // Filter by search query (client-side for current page)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.courseCode.toLowerCase().includes(query)
      );
    }

    // Sort courses (client-side for current page)
    result.sort((a, b) => {
      switch (sortBy) {
        case "code-asc":
          return a.courseCode.localeCompare(b.courseCode);
        case "code-desc":
          return b.courseCode.localeCompare(a.courseCode);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, sortBy, courses]);

  const getSortLabel = (): string => {
    const sortLabels: Record<SortOption, string> = {
      "code-asc": "Mã môn (A-Z)",
      "code-desc": "Mã môn (Z-A)",
      "title-asc": "Tên môn (A-Z)",
      "title-desc": "Tên môn (Z-A)",
    };
    return sortLabels[sortBy];
  };

  const getStatusDisplay = (status: CourseInstanceStatus) => {
    if (status === "ACTIVE") {
      return {
        label: "Đang hoạt động",
        bgColor: "bg-green-100",
        textColor: "text-green-500",
      };
    } else {
      return {
        label: "Đã lưu trữ",
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
      };
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <AdminLoading
          message="Đang tải danh sách khóa học..."
          minHeight={200}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-red-600">Có lỗi xảy ra</h2>
        <p className="mt-2 text-sm text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Khóa học của tôi" />
      <div className="space-y-4">
        {/* Search and Sort Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <button
              type="button"
              className="inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <span>{getSortLabel()}</span>
              {isSortOpen ? (
                <FiChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <FiChevronDown className="ml-2 h-4 w-4" />
              )}
            </button>
            {isSortOpen && (
              <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {[
                    { value: "title-asc", label: "Tên môn (A-Z)" },
                    { value: "title-desc", label: "Tên môn (Z-A)" },
                    { value: "code-asc", label: "Mã môn (A-Z)" },
                    { value: "code-desc", label: "Mã môn (Z-A)" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as SortOption);
                        setIsSortOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        sortBy === option.value
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {filteredAndSortedCourses.length === 0 ? (
            <div className="col-span-2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không tìm thấy khóa học
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Thử thay đổi từ khoá tìm kiếm
              </p>
            </div>
          ) : (
            filteredAndSortedCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                        {course.courseCode}
                      </span>
                      <Link
                        to={`/student/courses/${course.id}`}
                        className="hover:text-brand-600 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
                      </Link>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                      <span>{course.instructor}</span>
                      <span className="text-gray-400">•</span>
                      <span>{course.credits} tín chỉ</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {(() => {
                      const statusDisplay = getStatusDisplay(course.status);
                      return (
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
                        >
                          {statusDisplay.label}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-1">
                  <Link
                    to={`/student/courses/${course.id}`}
                    className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold bg-blue-600 text-white transition hover:border-brand-400 hover:bg-blue-700"
                  >
                    Tiếp tục học
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pageData && pageData.totalPages > 1 && (
          <div className="mt-6">
            <AdminPagination
              page={currentPage}
              totalPages={pageData.totalPages}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </div>
        )}

        {/* Pagination Info */}
        {pageData && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Hiển thị {pageData.numberOfElements} trong tổng số{" "}
            {pageData.totalElements} khóa học (Trang {pageData.number + 1} /{" "}
            {pageData.totalPages})
          </div>
        )}
      </div>
    </>
  );
};

export default StudentCourses;
