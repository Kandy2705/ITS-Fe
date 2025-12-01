import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminLoading from "../../components/common/AdminLoading";
import AdminPagination from "../../components/common/AdminPagination";
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
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: CourseInstanceStatus;
}

const statusLabels: Record<CourseInstanceStatus, string> = {
  ACTIVE: "Đang mở",
  INACTIVE: "Đã lưu trữ",
};

const AdminEnrollStudents = () => {
  const [courseInstances, setCourseInstances] = useState<CourseInstance[]>([]);
  const [courseInstancePage, setCourseInstancePage] =
    useState<PageResponse<CourseInstance> | null>(null);
  const [courseInstancePageIndex, setCourseInstancePageIndex] =
    useState<number>(0);

  const [students, setStudents] = useState<User[]>([]);
  const [selectedCourseInstanceId, setSelectedCourseInstanceId] =
    useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCourseInstances = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const ciRes = await api.get<ApiResponse<PageResponse<CourseInstance>>>(
        "/learning-management/courses-instance/getDetailsList",
        {
          params: {
            page,
            size: 10,
          },
        }
      );

      if (!ciRes.data.success) {
        throw new Error(
          ciRes.data.message || "Không thể tải danh sách lớp học"
        );
      }

      const pageData = ciRes.data.data;
      setCourseInstancePage(pageData);
      setCourseInstances(pageData.content || []);
      setCourseInstancePageIndex(pageData.number);
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
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadEligibleStudents = async (courseInstanceId: string) => {
    setStudents([]);
    setSelectedStudentIds([]);
    setStudentsLoading(true);
    setError(null);

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
        throw new Error(
          eligibleRes.data.message ||
            "Không thể tải danh sách sinh viên đủ điều kiện"
        );
      }

      const eligibleStudents = eligibleRes.data.data.content || [];
      setStudents(eligibleStudents);
    } catch (err: unknown) {
      let errorMessage =
        "Đã xảy ra lỗi khi tải danh sách sinh viên đủ điều kiện";
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
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    void loadCourseInstances(0);
  }, []);

  useEffect(() => {
    if (selectedCourseInstanceId) {
      void loadEligibleStudents(selectedCourseInstanceId);
    } else {
      setStudents([]);
      setSelectedStudentIds([]);
    }
  }, [selectedCourseInstanceId]);

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEnroll = async () => {
    if (!selectedCourseInstanceId || selectedStudentIds.length === 0) return;

    setSubmitting(true);

    try {
      const res = await api.post<ApiResponse<void>>(
        "/learning-management/courses-instance/enrollStudents",
        selectedStudentIds,
        {
          params: {
            courseInstanceId: selectedCourseInstanceId,
          },
        }
      );

      if (!res.data.success) {
        alert(res.data.message || "Không thể gán sinh viên vào lớp");
        return;
      }

      alert("Gán sinh viên vào lớp thành công");
      // Sau khi gán thành công, tải lại danh sách sinh viên đủ điều kiện
      // để những sinh viên vừa gán không còn xuất hiện nữa.
      await loadEligibleStudents(selectedCourseInstanceId);
      setSelectedStudentIds([]);
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi gán sinh viên";
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
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Gán sinh viên vào lớp"
        description="Chọn lớp học và sinh viên để gán"
      />
      <PageBreadcrumb pageTitle="Gán sinh viên vào lớp" />

      <div className="space-y-6 text-base">
        {/* Step 1: chọn lớp học */}
        <div className="rounded-2xl bg-white p-6 shadow-card border-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                1. Chọn lớp học (CourseInstance)
              </h2>
              <p className="mt-1 text-base text-gray-600">
                Chọn một lớp học mà bạn muốn gán sinh viên vào.
              </p>
            </div>
            <span className="text-base text-gray-500">
              Tổng: <strong>{courseInstancePage?.totalElements ?? 0}</strong>{" "}
              lớp
            </span>
          </div>

          {loading && (
            <div className="py-4">
              <AdminLoading
                message="Đang tải danh sách lớp học..."
                minHeight={80}
              />
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg bg-red-50 p-4 text-base text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200 text-base">
                <thead className="bg-gray-50 text-base uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium tracking-wider">
                      Chọn
                    </th>
                    <th className="px-4 py-3 text-left font-medium tracking-wider">
                      Môn học
                    </th>
                    <th className="px-4 py-3 text-left font-medium tracking-wider">
                      Giảng viên
                    </th>
                    <th className="px-4 py-3 text-left font-medium tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-base">
                  {courseInstances.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-base text-gray-500"
                      >
                        Chưa có lớp học nào.
                      </td>
                    </tr>
                  )}

                  {courseInstances.map((ci) => (
                    <tr
                      key={ci.id}
                      className={`cursor-pointer hover:bg-brand-50 ${
                        selectedCourseInstanceId === ci.id
                          ? "bg-brand-50"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedCourseInstanceId(ci.id)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="radio"
                          className="h-4 w-4 text-brand-500"
                          checked={selectedCourseInstanceId === ci.id}
                          onChange={() => setSelectedCourseInstanceId(ci.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-base text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">{ci.course.title}</span>
                          <span className="text-base text-gray-500">
                            {ci.course.code && `  Mã môn: ${ci.course.code}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-base text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {ci.teacher.firstName} {ci.teacher.lastName}
                          </span>
                          <span className="text-base text-gray-500">
                            {ci.teacher.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-base">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-base font-semibold ${
                            ci.status === "ACTIVE"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {statusLabels[ci.status] || ci.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {courseInstancePage && courseInstancePage.totalPages > 1 && (
                <AdminPagination
                  page={courseInstancePageIndex ?? 0}
                  totalPages={courseInstancePage.totalPages ?? 1}
                  onPageChange={(p) => void loadCourseInstances(p)}
                  disabled={loading}
                />
              )}
            </div>
          )}
        </div>

        {/* Step 2: chọn sinh viên */}
        <div className="rounded-2xl bg-white p-6 shadow-card border-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                2. Chọn sinh viên
              </h2>
              <p className="mt-1 text-base text-gray-600">
                Chọn một sinh viên để gán vào lớp đã chọn.
              </p>
            </div>
            <span className="text-base text-gray-500">
              Tổng: <strong>{students.length}</strong> sinh viên khả dụng
            </span>
          </div>

          {!selectedCourseInstanceId && (
            <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-base text-yellow-800">
              Vui lòng chọn một lớp học ở bước 1 trước khi chọn sinh viên.
            </div>
          )}

          {selectedCourseInstanceId && studentsLoading && (
            <div className="flex items-center justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            </div>
          )}

          {selectedCourseInstanceId && !studentsLoading && !error && (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200 text-base">
                <thead className="bg-gray-50 text-base uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium tracking-wider">
                      Chọn
                    </th>
                    <th className="px-4 py-3 text-left font-medium tracking-wider">
                      Họ tên
                    </th>
                    <th className="px-4 py-3 text-left font-medium tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-base">
                  {students.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-base text-gray-500"
                      >
                        Không còn sinh viên nào chưa đăng ký lớp này.
                      </td>
                    </tr>
                  )}

                  {students.map((s) => (
                    <tr
                      key={s.id}
                      className={`cursor-pointer hover:bg-brand-50 ${
                        selectedStudentIds.includes(s.id)
                          ? "bg-brand-50"
                          : "bg-white"
                      }`}
                      onClick={() => handleToggleStudent(s.id)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-brand-500"
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={() => handleToggleStudent(s.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-base text-gray-900">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-700">
                        {s.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Step 3: submit */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={
              submitting ||
              !selectedCourseInstanceId ||
              selectedStudentIds.length === 0
            }
            onClick={handleEnroll}
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-base font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Đang gán..." : "Gán sinh viên vào lớp"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminEnrollStudents;
