import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useNavigate, Link } from "react-router-dom";

// Types
type CourseStatus = "draft" | "public" | "private" | "paused";

interface Course {
  id: string;
  name: string;
  owner: string;
  learners: number;
  status: CourseStatus;
  updated: string;
  isDraft?: boolean;
}

// Mock data
const initialCourses: Course[] = [
  {
    id: "1",
    name: "Lập trình Web nâng cao",
    owner: "Lê Mỹ An",
    learners: 320,
    status: "public",
    updated: "Hôm nay",
    isDraft: false,
  },
  {
    id: "2",
    name: "Nhập môn AI",
    owner: "Nguyễn Huy",
    learners: 210,
    status: "public",
    updated: "Hôm qua",
    isDraft: false,
  },
  {
    id: "3",
    name: "Phân tích dữ liệu",
    owner: "Trần Minh",
    learners: 145,
    status: "paused",
    updated: "3 ngày trước",
    isDraft: false,
  },
  {
    id: "4",
    name: "Học máy cơ bản",
    owner: "Admin",
    learners: 0,
    status: "draft",
    updated: "1 giờ trước",
    isDraft: true,
  },
];

const statusLabels: Record<CourseStatus, string> = {
  draft: "Bản nháp",
  public: "Công khai",
  private: "Riêng tư",
  paused: "Tạm dừng",
};

const AdminCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses based on status and search query
  const filteredCourses = courses.filter((course) => {
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateCourse = () => {
    navigate("/admin/courses/new");
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse?.name) return;

    setCourses((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === currentCourse.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...currentCourse,
        };
        return updated;
      } else {
        return [...prev, currentCourse as Course];
      }
    });

    setShowCreateModal(false);
    setCurrentCourse(null);
  };

  const toggleCourseStatus = (courseId: string, newStatus: CourseStatus) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, status: newStatus, updated: "Vừa xong" }
          : course
      )
    );
  };

  const publishDraft = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, isDraft: false, status: "public", updated: "Vừa xong" }
          : course
      )
    );
  };

  const deleteCourse = (courseId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    }
  };
  return (
    <>
      <PageMeta
        title="Quản lý khóa học"
        description="Admin quản lý toàn bộ khoá học trên hệ thống"
      />
      <PageBreadcrumb pageTitle="Quản lý khóa học" />
      <div className="space-y-4 text-base">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-card ">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Tổng khoá học
            </p>
            <p className="text-3xl font-bold text-brand-700">186</p>
            <p className="text-base text-gray-600">Bao gồm cả lộ trình ITS</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-card">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Cần duyệt
            </p>
            <p className="text-3xl font-bold text-orange-600">14</p>
            <p className="text-base text-gray-600">
              Khoá mới do giảng viên gửi lên
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] p-5 shadow-card">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Báo cáo vi phạm
            </p>
            <p className="text-3xl font-bold text-gray-900">4</p>
            <p className="text-base text-gray-600">Cần kiểm tra nội dung</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách khoá học
              </h2>
              <p className="text-base text-gray-600">
                Quản trị nhanh trạng thái, báo cáo và xuất dữ liệu.
              </p>

              {/* Search and Filters */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    className="rounded-lg border border-gray-300 px-3 py-2 pr-8 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
                </div>

                <select
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as CourseStatus | "all")
                  }
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="draft">Bản nháp</option>
                  <option value="public">Công khai</option>
                  <option value="private">Riêng tư</option>
                  <option value="paused">Tạm dừng</option>
                </select>
              </div>
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
              <button className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 transition hover:border-brand-400 hover:bg-brand-50">
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Xuất báo cáo
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-base text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-sm font-semibold uppercase text-gray-500">
                  <th className="px-3 py-2">Tên khoá</th>
                  <th className="px-3 py-2">Giảng viên</th>
                  <th className="px-3 py-2">Học viên</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  <th className="px-3 py-2">Cập nhật</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => {
                  const statusClass = {
                    draft: "bg-gray-100 text-gray-800",
                    public: "bg-green-50 text-green-700",
                    private: "bg-blue-50 text-blue-700",
                    paused: "bg-yellow-50 text-yellow-700",
                  }[course.status];

                  return (
                    <tr
                      key={course.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-3 py-3 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          {course.name}
                          {/* {course.isDraft && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600">
                              Bản nháp
                            </span>
                          )} */}
                        </div>
                      </td>
                      <td className="px-3 py-3">{course.owner}</td>
                      <td className="px-3 py-3">{course.learners}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusClass}`}
                        >
                          {statusLabels[course.status]}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-base text-gray-600">
                        {course.updated}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentCourse(course);
                              setShowCreateModal(true);
                            }}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-brand-400 hover:bg-brand-50"
                          >
                            Chỉnh sửa nhanh
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/courses/${course.id}/edit`)
                            }
                            className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
                          >
                            Chỉnh sửa chi tiết
                          </button>

                          {course.isDraft ? (
                            <button
                              onClick={() => publishDraft(course.id)}
                              className="rounded-lg border border-green-500 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-100"
                            >
                              Xuất bản
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  toggleCourseStatus(
                                    course.id,
                                    course.status === "public"
                                      ? "private"
                                      : "public"
                                  )
                                }
                                className="rounded-lg border border-blue-500 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                              >
                                {course.status === "public"
                                  ? "Chuyển riêng tư"
                                  : "Chuyển công khai"}
                              </button>
                              <button
                                onClick={() =>
                                  toggleCourseStatus(course.id, "paused")
                                }
                                className="rounded-lg border border-yellow-500 bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-700 transition hover:bg-yellow-100"
                              >
                                Tạm dừng
                              </button>
                            </>
                          )}

                          <Link
                            to={`/admin/courses/${course.id}`}
                            className="ml-2 rounded-lg border border-blue-100 bg-blue-50 p-1.5 text-blue-500 transition hover:bg-blue-100"
                            title="Xem chi tiết khóa học"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="ml-1 rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100"
                            title="Xóa khóa học"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Course Modal - Only shown when editing existing course */}
      {showCreateModal && currentCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Chỉnh sửa khóa học
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCurrentCourse(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveCourse}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tên khóa học
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    value={currentCourse?.name || ""}
                    onChange={(e) =>
                      setCurrentCourse((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    value={currentCourse?.status || "draft"}
                    onChange={(e) =>
                      setCurrentCourse((prev) => ({
                        ...prev!,
                        status: e.target.value as CourseStatus,
                      }))
                    }
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="public">Công khai</option>
                    <option value="private">Riêng tư</option>
                    {currentCourse?.isDraft && (
                      <option value="public">Xuất bản ngay</option>
                    )}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setCurrentCourse(null);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCourses;
