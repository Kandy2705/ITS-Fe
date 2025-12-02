import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminLoading from "../../components/common/AdminLoading";
import AdminPagination from "../../components/common/AdminPagination";
import { Modal } from "../../components/ui/modal";
import api from "../../utils/api";
import type { User } from "../../interfaces/user";
import type { PageResponse } from "../../interfaces/pagination";
import type { ApiResponse } from "../../interfaces/api";
import { Eye, Archive, ArchiveRestore } from "lucide-react";

type CourseInstanceStatus = "ACTIVE" | "INACTIVE";

interface Course {
  id: string;
  title: string;
  code: string | null;
}

interface CourseInstance {
  id: string;
  course: Course;
  teacher: User;
  status: CourseInstanceStatus;
}

const statusLabels: Record<CourseInstanceStatus, string> = {
  ACTIVE: "Đang mở",
  INACTIVE: "Đã lưu trữ",
};

const statusColors: Record<CourseInstanceStatus, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
};

const AdminCourseInstances = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const [allInstances, setAllInstances] = useState<CourseInstance[]>([]);
  const [instancesLoading, setInstancesLoading] = useState(false);
  const [instancesError, setInstancesError] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courseId ?? ""
  );

  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [archiveSuccess, setArchiveSuccess] = useState<string | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveTargetId, setArchiveTargetId] = useState<string | null>(null);
  const [archiveTargetStatus, setArchiveTargetStatus] =
    useState<CourseInstanceStatus | null>(null);

  const loadInstances = useCallback(async () => {
    setInstancesLoading(true);
    setInstancesError(null);

    try {
      const res = await api.get<ApiResponse<PageResponse<CourseInstance>>>(
        "/learning-management/courses-instance/getDetailsList",
        {
          params: {
            page: 0,
            size: 200,
          },
        }
      );

      if (!res.data.success) {
        setInstancesError(
          res.data.message || "Không thể tải danh sách lớp học (courseInstance)"
        );
        return;
      }

      const all = res.data.data?.content || [];
      setAllInstances(all);
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tải danh sách lớp học";
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
      setInstancesError(errorMessage);
    } finally {
      setInstancesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInstances();
  }, [loadInstances]);

  useEffect(() => {
    const loadCourses = async () => {
      setCoursesLoading(true);
      try {
        const res = await api.get<ApiResponse<PageResponse<Course>>>(
          "/learning-management/courses",
          {
            params: {
              page: 0,
              size: 100,
              status: "ACTIVE",
            },
          }
        );

        if (res.data.success) {
          setCourses(res.data.data?.content || []);
        }
      } catch {
        // ignore filter course error
      } finally {
        setCoursesLoading(false);
      }
    };

    void loadCourses();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [selectedCourseId]);

  const filteredInstances = useMemo(() => {
    if (!selectedCourseId) return allInstances;
    return allInstances.filter((ci) => ci.course?.id === selectedCourseId);
  }, [allInstances, selectedCourseId]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInstances.length / pageSize) || 1
  );

  const pagedInstances = useMemo(
    () => filteredInstances.slice(page * pageSize, page * pageSize + pageSize),
    [filteredInstances, page, pageSize]
  );

  const handleChangeInstanceStatus = async (
    courseInstanceId: string,
    newStatus: CourseInstanceStatus
  ) => {
    setArchivingId(courseInstanceId);
    setArchiveError(null);
    setArchiveSuccess(null);

    try {
      const res = await api.post<ApiResponse<void>>(
        "/learning-management/courses-instance/updateStatus",
        {
          courseInstanceId,
          newStatus,
        }
      );

      if (!res.data.success) {
        setArchiveError(
          res.data.message ||
            "Không thể cập nhật trạng thái lớp học vào lúc này."
        );
        return;
      }

      setArchiveSuccess(
        newStatus === "INACTIVE"
          ? "Đã lưu trữ lớp học thành công."
          : "Đã kích hoạt lại lớp học thành công."
      );
      await loadInstances();
    } catch (err: unknown) {
      let message = "Đã xảy ra lỗi khi cập nhật trạng thái lớp học.";
      if (axios.isAxiosError(err)) {
        if (err.response?.data && typeof err.response.data === "object") {
          const data = err.response.data as { message?: string };
          message = data.message || err.message || message;
        } else {
          message = err.message || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setArchiveError(message);
    } finally {
      setArchivingId(null);
    }
  };

  return (
    <>
      <PageMeta
        title="Danh sách lớp học"
        description="Xem danh sách lớp học (CourseInstance) và giảng viên phụ trách"
      />
      <PageBreadcrumb pageTitle="Danh sách lớp học" />
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="rounded-2xl bg-white p-5 shadow-card border-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between ">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Lọc theo khóa học
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Nếu không chọn khóa học, hệ thống sẽ hiển thị toàn bộ lớp học.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:w-80">
              <label className="text-xs font-semibold uppercase text-gray-500">
                Khóa học
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">
                  {coursesLoading
                    ? "Đang tải danh sách khóa..."
                    : "Tất cả khóa học"}
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code ? `[${course.code}] ` : ""}
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {(archiveError || archiveSuccess) && (
          <div
            className={`rounded-2xl bg-white p-4 text-sm shadow-card ${
              archiveError ? "text-red-700" : "font-semibold text-green-700"
            }`}
          >
            {archiveError || archiveSuccess}
          </div>
        )}

        {/* State: loading / error for instances */}
        {instancesLoading && (
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <AdminLoading
              message="Đang tải danh sách lớp học..."
              minHeight={160}
            />
          </div>
        )}

        {instancesError && !instancesLoading && (
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-red-600">
              Có lỗi xảy ra
            </h2>
            <p className="mt-2 text-sm text-gray-700">{instancesError}</p>
          </div>
        )}

        {!instancesLoading && !instancesError && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base text-gray-600">
                Đang hiển thị{" "}
                <span className="font-semibold text-gray-900">
                  {filteredInstances.length}
                </span>{" "}
                lớp học
                {selectedCourseId && " cho khóa đã chọn"}.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-card border-2">
              <table className="min-w-full divide-y divide-gray-200 text-base bg-white">
                <thead className="bg-gray-50 text-sm">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-gray-500">
                      Môn học
                    </th>
                    <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-gray-500">
                      Giảng viên
                    </th>
                    <th className="px-4 py-3 text-left font-medium uppercase tracking-wider text-gray-500">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-right font-medium uppercase tracking-wider text-gray-500">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-base">
                  {pagedInstances.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-base text-gray-500"
                      >
                        Chưa có lớp học (courseInstance) nào.
                      </td>
                    </tr>
                  )}

                  {pagedInstances.map((ci) => (
                    <tr key={ci.id}>
                      <td className="px-4 py-3 text-base text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">{ci.course.title}</span>
                          {ci.course.code && (
                            <span className="text-sm text-gray-500">
                              Mã: {ci.course.code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-base text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {ci.teacher.firstName} {ci.teacher.lastName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {ci.teacher.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-base">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                            statusColors[ci.status] || statusColors.ACTIVE
                          }`}
                        >
                          {statusLabels[ci.status] || ci.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-base">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/course-instances/${ci.id}`}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            <Eye />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setArchiveTargetId(ci.id);
                              setArchiveTargetStatus(ci.status);
                              setIsArchiveModalOpen(true);
                            }}
                            disabled={archivingId === ci.id}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                              ci.status === "INACTIVE"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {ci.status === "INACTIVE" ? (
                              <ArchiveRestore />
                            ) : (
                              <Archive />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredInstances.length > 0 && (
                <AdminPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => {
          setIsArchiveModalOpen(false);
          setArchiveTargetId(null);
          setArchiveTargetStatus(null);
        }}
        className="max-w-lg p-6"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {archiveTargetStatus === "INACTIVE"
                ? "Kích hoạt lại lớp học"
                : "Xác nhận lưu trữ lớp học"}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {archiveTargetStatus === "INACTIVE"
                ? "Bạn có muốn kích hoạt lại lớp học này? Sinh viên sẽ có thể tham gia lại."
                : "Bạn có chắc chắn muốn lưu trữ lớp học này? Sinh viên sẽ không thể tham gia thêm sau khi lưu trữ."}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsArchiveModalOpen(false);
                setArchiveTargetId(null);
                setArchiveTargetStatus(null);
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={
                !archiveTargetId ||
                !archiveTargetStatus ||
                archivingId === archiveTargetId
              }
              onClick={async () => {
                if (!archiveTargetId || !archiveTargetStatus) return;
                await handleChangeInstanceStatus(
                  archiveTargetId,
                  archiveTargetStatus === "INACTIVE" ? "ACTIVE" : "INACTIVE"
                );
                setIsArchiveModalOpen(false);
                setArchiveTargetId(null);
                setArchiveTargetStatus(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                archiveTargetStatus === "INACTIVE"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {archivingId === archiveTargetId
                ? "Đang xử lý..."
                : archiveTargetStatus === "INACTIVE"
                ? "Kích hoạt lại"
                : "Xác nhận lưu trữ"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AdminCourseInstances;
