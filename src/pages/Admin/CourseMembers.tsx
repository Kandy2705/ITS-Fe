import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const PAGE_SIZE = 10;

const CourseMembers = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [instance, setInstance] = useState<CourseInstance | null>(null);
  const [instanceLoading, setInstanceLoading] = useState(false);
  const [instanceError, setInstanceError] = useState<string | null>(null);

  const [studentsPage, setStudentsPage] = useState<PageResponse<User> | null>(
    null
  );
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [studentPageIndex, setStudentPageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [eligibleStudents, setEligibleStudents] = useState<User[]>([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const [eligibleError, setEligibleError] = useState<string | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [archiveSuccess, setArchiveSuccess] = useState<string | null>(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const loadInstance = useCallback(async () => {
    if (!id) {
      setInstanceError("Không tìm thấy ID lớp học");
      return;
    }

    setInstanceLoading(true);
    setInstanceError(null);

    try {
      const res = await api.get<ApiResponse<CourseInstance>>(
        "/learning-management/courses-instance/getDetails",
        {
          params: {
            courseInstanceId: id,
          },
        }
      );

      if (!res.data.success) {
        setInstanceError(
          res.data.message || "Không thể tải thông tin lớp học (CourseInstance)"
        );
        return;
      }

      setInstance(res.data.data || null);
    } catch (err: unknown) {
      let message = "Đã xảy ra lỗi khi tải thông tin lớp học";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          message = "Lớp học không tồn tại hoặc đã bị xóa";
        } else if (
          err.response?.data &&
          typeof err.response.data === "object"
        ) {
          const data = err.response.data as { message?: string };
          message = data.message || err.message || message;
        } else {
          message = err.message || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setInstanceError(message);
    } finally {
      setInstanceLoading(false);
    }
  }, [id]);

  const loadStudents = useCallback(
    async (page: number) => {
      if (!id) return;

      setStudentsLoading(true);
      setStudentsError(null);

      try {
        const res = await api.get<ApiResponse<PageResponse<User>>>(
          "/learning-management/courses-instance/getAllStudentDetails",
          {
            params: {
              courseInstanceId: id,
              page,
              size: PAGE_SIZE,
            },
          }
        );

        if (!res.data.success) {
          setStudentsError(
            res.data.message || "Không thể tải danh sách sinh viên của lớp"
          );
          return;
        }

        setStudentsPage(res.data.data || null);
        setStudentPageIndex(page);
      } catch (err: unknown) {
        let errorMessage = "Đã xảy ra lỗi khi tải danh sách sinh viên";
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
        setStudentsError(errorMessage);
      } finally {
        setStudentsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    void loadInstance();
  }, [loadInstance]);

  useEffect(() => {
    void loadStudents(0);
  }, [loadStudents]);

  const loadEligibleStudents = useCallback(async (courseInstanceId: string) => {
    setEligibleLoading(true);
    setEligibleError(null);
    setEnrollError(null);
    setEnrollSuccess(null);

    try {
      const eligibleRes = await api.get<ApiResponse<PageResponse<User>>>(
        "/learning-management/courses-instance/getAllEligibleStudents",
        {
          params: {
            courseInstanceId,
            page: 0,
            size: 200,
          },
        }
      );

      if (!eligibleRes.data.success) {
        setEligibleError(
          eligibleRes.data.message ||
            "Không thể tải danh sách sinh viên khả dụng"
        );
        setEligibleStudents([]);
        return;
      }

      setEligibleStudents(eligibleRes.data.data?.content || []);
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tải danh sách sinh viên khả dụng";
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
      setEligibleError(errorMessage);
      setEligibleStudents([]);
    } finally {
      setEligibleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      void loadEligibleStudents(id);
    }
  }, [id, loadEligibleStudents]);

  const filteredStudents = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    const students = studentsPage?.content || [];

    if (!keyword) return students;

    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return (
        fullName.includes(keyword) ||
        student.email.toLowerCase().includes(keyword)
      );
    });
  }, [searchQuery, studentsPage]);

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((item) => item !== studentId)
        : [...prev, studentId]
    );
  };

  const handleEnrollStudents = async () => {
    if (!id || selectedStudentIds.length === 0) {
      setEnrollError("Vui lòng chọn ít nhất một sinh viên để gán vào lớp.");
      setEnrollSuccess(null);
      return;
    }

    setEnrollError(null);
    setEnrollSuccess(null);
    setEnrolling(true);

    try {
      const res = await api.post<ApiResponse<void>>(
        "/learning-management/courses-instance/enrollStudents",
        selectedStudentIds,
        {
          params: {
            courseInstanceId: id,
          },
        }
      );

      if (!res.data.success) {
        setEnrollError(
          res.data.message || "Không thể gán sinh viên vào lớp học này."
        );
        return;
      }

      setEnrollSuccess("Đã gán sinh viên vào lớp thành công.");
      setSelectedStudentIds([]);
      await Promise.all([
        loadStudents(studentPageIndex),
        loadEligibleStudents(id),
      ]);
    } catch (err: unknown) {
      let message = "Đã xảy ra lỗi khi gán sinh viên";
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
      setEnrollError(message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleChangeCourseInstanceStatus = async (
    newStatus: CourseInstanceStatus
  ) => {
    if (!id) {
      setArchiveError("Không tìm thấy ID lớp học.");
      setArchiveSuccess(null);
      return;
    }

    setArchiving(true);
    setArchiveError(null);
    setArchiveSuccess(null);

    try {
      const res = await api.post<ApiResponse<void>>(
        "/learning-management/courses-instance/updateStatus",
        {
          courseInstanceId: id,
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
      await loadInstance();
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
      setArchiving(false);
    }
  };

  const renderInstanceSection = () => {
    if (instanceLoading) {
      return (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <AdminLoading
            message="Đang tải thông tin lớp học..."
            minHeight={180}
          />
        </div>
      );
    }

    if (instanceError) {
      return (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="rounded-full bg-red-100 p-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {instanceError}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Vui lòng kiểm tra lại hoặc quay về danh sách lớp học.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Thử lại
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!instance) return null;

    return (
      <>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500">
                Thông tin lớp học
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {instance.course.title}
                </h1>
                <p className="font-mono text-sm text-gray-600">
                  {instance.course.code
                    ? `Mã khóa: ${instance.course.code}`
                    : "Chưa có mã khóa"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColors[instance.status] || statusColors.INACTIVE
                }`}
              >
                {statusLabels[instance.status] || instance.status}
              </span>
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(true)}
                disabled={archiving}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  instance.status === "INACTIVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {instance.status === "INACTIVE"
                  ? "Kích hoạt lại lớp"
                  : "Lưu trữ lớp"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/courses/instances")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Về danh sách lớp
              </button>
            </div>
            {(archiveError || archiveSuccess) && (
              <div
                className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                  archiveError
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 font-semibold text-green-700"
                }`}
              >
                {archiveError || archiveSuccess}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">
            Giảng viên phụ trách
          </h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Họ tên: </span>
              {instance.teacher.firstName} {instance.teacher.lastName}
            </p>
            <p>
              <span className="font-semibold">Email: </span>
              {instance.teacher.email}
            </p>
            <p>
              <span className="font-semibold">Vai trò: </span>
              {instance.teacher.role}
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderStudentsSection = () => {
    if (!instance) return null;

    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách sinh viên đã tham gia lớp
            </h2>
            <p className="text-sm text-gray-600">
              Hiển thị danh sách sinh viên đang học lớp này. Sử dụng tìm kiếm để
              lọc theo tên hoặc email.
            </p>
          </div>
          <div className="w-full max-w-xs">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên/email..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {studentsLoading && (
          <div className="py-6">
            <AdminLoading
              message="Đang tải danh sách sinh viên..."
              minHeight={100}
            />
          </div>
        )}

        {studentsError && !studentsLoading && (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {studentsError}
          </div>
        )}

        {!studentsLoading && !studentsError && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Họ tên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Vai trò
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-gray-500"
                    >
                      {searchQuery
                        ? "Không có sinh viên nào khớp với tìm kiếm."
                        : "Hiện chưa có sinh viên nào tham gia lớp này."}
                    </td>
                  </tr>
                )}

                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.role}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          student.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {studentsPage && studentsPage.totalPages > 1 && (
              <AdminPagination
                page={studentPageIndex}
                totalPages={studentsPage.totalPages}
                onPageChange={(nextPage) => {
                  setStudentPageIndex(nextPage);
                  void loadStudents(nextPage);
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderEnrollmentSection = () => {
    if (!instance) return null;

    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Gán sinh viên trực tiếp
            </h2>
            <p className="text-sm text-gray-600">
              Chọn những sinh viên chưa tham gia để gán vào lớp học này.
            </p>
          </div>
          <span className="text-sm text-gray-500">
            Sinh viên khả dụng: <strong>{eligibleStudents.length}</strong>
          </span>
        </div>

        {eligibleLoading && (
          <div className="py-4">
            <AdminLoading
              message="Đang tải danh sách sinh viên khả dụng..."
              minHeight={100}
            />
          </div>
        )}

        {eligibleError && !eligibleLoading && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {eligibleError}
          </div>
        )}

        {!eligibleLoading && !eligibleError && (
          <>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Chọn
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Họ tên
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {eligibleStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        Tất cả sinh viên đã được gán cho lớp này.
                      </td>
                    </tr>
                  )}

                  {eligibleStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-brand-500"
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={() => handleToggleStudent(student.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {student.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {enrollError && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {enrollError}
              </div>
            )}

            {enrollSuccess && (
              <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                {enrollSuccess}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleEnrollStudents}
                disabled={enrolling || selectedStudentIds.length === 0}
                className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enrolling ? "Đang gán..." : "Gán sinh viên đã chọn"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <PageMeta
        title="Quản lý thành viên lớp học"
        description="Xem thông tin giảng viên và sinh viên trong lớp học"
      />

      <div className="space-y-4">
        <PageBreadcrumb pageTitle="Quản lý thành viên lớp học" />

        {renderInstanceSection()}
        {renderEnrollmentSection()}
        {renderStudentsSection()}
      </div>

      {instance && (
        <Modal
          isOpen={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
          className="max-w-lg p-6"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {instance.status === "INACTIVE"
                  ? "Kích hoạt lại lớp học"
                  : "Xác nhận lưu trữ lớp học"}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {instance.status === "INACTIVE"
                  ? "Bạn có muốn kích hoạt lại lớp học này? Sinh viên sẽ có thể tham gia lại."
                  : "Bạn có chắc chắn muốn lưu trữ lớp học này? Sinh viên sẽ không thể tham gia thêm sau khi lưu trữ."}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={archiving}
                onClick={async () => {
                  await handleChangeCourseInstanceStatus(
                    instance.status === "INACTIVE" ? "ACTIVE" : "INACTIVE"
                  );
                  setIsArchiveModalOpen(false);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  instance.status === "INACTIVE"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {archiving
                  ? "Đang xử lý..."
                  : instance.status === "INACTIVE"
                  ? "Kích hoạt lại"
                  : "Xác nhận lưu trữ"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CourseMembers;
