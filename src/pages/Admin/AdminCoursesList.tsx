import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import api from "../../utils/api";
import { PageResponse } from "../../interfaces/pagination";

const PAGE_SIZE = 10;

interface Course {
  id: string;
  title: string;
  code: string | null;
  description: string | null;
  credit: string | null;
  status: "ACTIVE" | "INACTIVE";
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  INACTIVE: "bg-orange-50 text-orange-700",
};

const AdminCoursesList = () => {
  const navigate = useNavigate();
  const [courseList, setCourseList] = useState<PageResponse<Course> | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(
    async (page: number = 0, keyword?: string, status?: string) => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number> = {
          page,
          size: PAGE_SIZE,
        };

        if (keyword && keyword.trim()) {
          params.keyword = keyword.trim();
        }

        if (status) {
          params.status = status;
        }

        const res = await api.get("/learning-management/courses", { params });

        if (res.data.success) {
          setCourseList(res.data.data);
          setCurrentPage(page);
        } else {
          setError(res.data.message || "Không thể tải danh sách khóa học");
        }
      } catch (err: unknown) {
        let errorMessage = "Đã xảy ra lỗi khi tải danh sách khóa học";
        if (axios.isAxiosError(err)) {
          errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Đã xảy ra lỗi khi tải danh sách khóa học";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCourses(0, searchQuery, statusFilter);
  }, [searchQuery, statusFilter, fetchCourses]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected;
    fetchCourses(newPage, searchQuery, statusFilter);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(0, searchQuery, statusFilter);
  };

  const handleCreateCourse = () => {
    navigate("/admin/courses/new");
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      return;
    }

    try {
      const res = await api.delete(`/learning-management/courses/${courseId}`);
      if (res.data.success) {
        // Reload the list
        fetchCourses(currentPage, searchQuery, statusFilter);
      } else {
        alert(res.data.message || "Không thể xóa khóa học");
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi xóa khóa học";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Đã xảy ra lỗi khi xóa khóa học";
      }
      alert(errorMessage);
    }
  };

  return (
    <>
      <PageMeta
        title="Danh sách khóa học"
        description="Quản lý toàn bộ khóa học trên hệ thống"
      />
      <div className="space-y-4 text-base">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-card border-2">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Tổng khóa học
            </p>
            <p className="text-3xl font-bold text-brand-700">
              {courseList?.totalElements || 0}
            </p>
            <p className="text-base text-gray-600">Tất cả khóa học</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card border-2">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Đang hoạt động
            </p>
            <p className="text-3xl font-bold text-green-600">
              {courseList?.content.filter((c) => c.status === "ACTIVE")
                .length || 0}
            </p>
            <p className="text-base text-gray-600">Khóa học đang mở</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card border-2">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Trang hiện tại
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {courseList ? courseList.number + 1 : 0} /{" "}
              {courseList?.totalPages || 0}
            </p>
            <p className="text-base text-gray-600">
              {courseList?.numberOfElements || 0} khóa học
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card border-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách khóa học
              </h2>
              <p className="text-base text-gray-600">
                Quản trị và xem chi tiết khóa học trên hệ thống.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-base font-semibold text-gray-700">
              <button
                onClick={handleCreateCourse}
                className="flex items-center gap-1.5 rounded-full border border-brand-500 bg-brand-500 px-4 py-1.5 text-white transition hover:bg-brand-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Tạo khóa học mới
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-base font-semibold text-red-800">{error}</p>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <form
              onSubmit={handleSearch}
              className="relative flex-1 min-w-[200px]"
            >
              <input
                type="text"
                placeholder="Tìm kiếm khóa học (tiêu đề, mã)..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            <select
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Ngừng hoạt động</option>
            </select>

            {loading && (
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                Đang tải dữ liệu khóa học...
              </div>
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-base text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-sm font-semibold uppercase text-gray-500">
                  <th className="px-3 py-2">Mã khóa học</th>
                  <th className="px-3 py-2">Tên khóa học</th>
                  <th className="px-3 py-2">Tín chỉ</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-base">
                {courseList && courseList.content.length > 0 ? (
                  courseList.content.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-3 py-3 font-mono text-sm text-gray-600">
                        {course.code || "-"}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          to={`/admin/courses/${course.id}`}
                          className="font-semibold text-gray-900 hover:text-brand-600"
                        >
                          {course.title}
                        </Link>
                      </td>
                      <td className="px-3 py-3">{course.credit || "-"}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                            statusColors[course.status] ||
                            statusColors["INACTIVE"]
                          }`}
                        >
                          {statusLabels[course.status] || course.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-2 text-base">
                          <Link
                            to={`/admin/courses/${course.id}`}
                            className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                            title="Xem chi tiết"
                          >
                            Chi tiết
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
                            title="Xóa khóa học"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-base text-gray-500"
                    >
                      {loading
                        ? "Đang tải dữ liệu khóa học..."
                        : "Không tìm thấy khóa học nào"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {courseList && courseList.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center">
              <ReactPaginate
                previousLabel={
                  <span className="inline-flex items-center gap-1 text-base font-semibold text-gray-700">
                    Trước
                  </span>
                }
                nextLabel={
                  <span className="inline-flex items-center gap-1 text-base font-semibold text-gray-700">
                    Sau
                  </span>
                }
                breakLabel={
                  <span className="px-2 text-base text-gray-500">...</span>
                }
                pageCount={courseList.totalPages}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                forcePage={currentPage}
                containerClassName="flex items-center gap-1"
                pageLinkClassName="px-3 py-2 text-base font-semibold text-gray-700 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition min-w-[40px] text-center"
                previousClassName="mr-2"
                previousLinkClassName="px-3 py-2 text-base font-semibold text-gray-700 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition"
                nextClassName="ml-2"
                nextLinkClassName="px-3 py-2 text-base font-semibold text-gray-700 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition"
                breakLinkClassName="px-2 py-2 text-base text-gray-500"
                activeLinkClassName="bg-brand-500 text-white border-brand-500 hover:bg-brand-600 hover:border-brand-600"
                disabledClassName="opacity-50 cursor-not-allowed"
                disabledLinkClassName="cursor-not-allowed hover:bg-transparent hover:border-gray-200"
              />
            </div>
          )}

          {courseList && (
            <div className="mt-4 text-base text-gray-600">
              Hiển thị {courseList.numberOfElements} trong tổng số{" "}
              {courseList.totalElements} khóa học (Trang {courseList.number + 1}{" "}
              / {courseList.totalPages})
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCoursesList;
