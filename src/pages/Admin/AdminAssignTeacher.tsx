import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import api from "../../utils/api";
import { User } from "../../interfaces/user";

interface Course {
  id: string;
  title: string;
  code: string | null;
  status: "ACTIVE" | "INACTIVE";
}

const AdminAssignTeacher = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/learning-management/courses", {
        params: {
          page: 0,
          size: 100, // Get all courses
          status: "ACTIVE", // Only show active courses
        },
      });

      if (res.data.success) {
        setCourses(res.data.data.content || []);
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
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch teachers
  const fetchTeachers = useCallback(async () => {
    try {
      const res = await api.get("/users", {
        params: {
          role: "TEACHER",
          status: "ACTIVE",
          page: 0,
          size: 100, // Get all teachers
        },
      });

      if (res.data.success) {
        setTeachers(res.data.data.content || []);
      }
    } catch (err: unknown) {
      console.error("Error fetching teachers:", err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, [fetchCourses, fetchTeachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCourseId) {
      setError("Vui lòng chọn khóa học");
      return;
    }

    if (!selectedTeacherId) {
      setError("Vui lòng chọn giáo viên");
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post("/learning-management/assign", null, {
        params: {
          courseId: selectedCourseId,
          teacherId: selectedTeacherId,
        },
      });

      if (res.data.success) {
        const selectedCourse = courses.find((c) => c.id === selectedCourseId);
        const selectedTeacher = teachers.find(
          (t) => t.id === selectedTeacherId
        );
        setSuccess(
          `Đã gán giáo viên ${selectedTeacher?.firstName} ${selectedTeacher?.lastName} vào khóa học ${selectedCourse?.title} thành công!`
        );
        // Reset form
        setSelectedCourseId("");
        setSelectedTeacherId("");
      } else {
        setError(res.data.message || "Không thể gán giáo viên vào khóa học");
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi gán giáo viên vào khóa học";
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          errorMessage =
            err.response?.data?.message ||
            "Giáo viên đã được gán vào khóa học này hoặc dữ liệu không hợp lệ";
        } else {
          errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Đã xảy ra lỗi khi gán giáo viên vào khóa học";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);

  return (
    <>
      <PageMeta
        title="Gán giáo viên vào khóa học"
        description="Phân công giáo viên phụ trách các khóa học"
      />
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <nav className="flex text-sm text-gray-600">
            <Link to="/admin" className="hover:text-brand-600">
              Admin
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Gán giáo viên</span>
          </nav>
        </div>

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Gán giáo viên vào khóa học
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Phân công giáo viên phụ trách các khóa học trên hệ thống
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-semibold text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
              <p className="text-sm font-medium text-gray-700">
                Đang tải dữ liệu...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        {!loading && (
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Chọn khóa học <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code ? `[${course.code}] ` : ""}
                      {course.title}
                    </option>
                  ))}
                </select>
                {selectedCourse && (
                  <p className="mt-2 text-xs text-gray-600">
                    Mã khóa học: {selectedCourse.code || "Chưa có mã"}
                  </p>
                )}
              </div>

              {/* Teacher Selection */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Chọn giáo viên <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => {
                    setSelectedTeacherId(e.target.value);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">-- Chọn giáo viên --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName} ({teacher.email})
                    </option>
                  ))}
                </select>
                {selectedTeacher && (
                  <p className="mt-2 text-xs text-gray-600">
                    Email: {selectedTeacher.email}
                  </p>
                )}
              </div>

              {/* Summary */}
              {selectedCourse && selectedTeacher && (
                <div className="rounded-lg bg-brand-50 border border-brand-200 p-4">
                  <h3 className="text-sm font-semibold text-brand-900 mb-2">
                    Xác nhận thông tin:
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Khóa học:</span>{" "}
                      {selectedCourse.code ? `[${selectedCourse.code}] ` : ""}
                      {selectedCourse.title}
                    </p>
                    <p>
                      <span className="font-semibold">Giáo viên:</span>{" "}
                      {selectedTeacher.firstName} {selectedTeacher.lastName} (
                      {selectedTeacher.email})
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Link
                  to="/admin/courses"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Hủy bỏ
                </Link>
                <button
                  type="submit"
                  disabled={
                    submitting || !selectedCourseId || !selectedTeacherId
                  }
                  className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Đang gán..." : "Gán giáo viên"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Tổng khóa học
            </p>
            <p className="text-3xl font-bold text-brand-700">
              {courses.length}
            </p>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Tổng giáo viên
            </p>
            <p className="text-3xl font-bold text-green-600">
              {teachers.length}
            </p>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Hướng dẫn
            </p>
            <p className="text-sm text-gray-600">
              Chọn khóa học và giáo viên, sau đó nhấn "Gán giáo viên"
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAssignTeacher;
