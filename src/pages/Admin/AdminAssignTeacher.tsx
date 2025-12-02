import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminLoading from "../../components/common/AdminLoading";
import AdminPagination from "../../components/common/AdminPagination";
import api from "../../utils/api";
import { User } from "../../interfaces/user";
import type { PageResponse } from "../../interfaces/pagination";
import type { ApiResponse } from "../../interfaces/api";

interface Course {
  id: string;
  title: string;
  code: string | null;
  status: "ACTIVE" | "INACTIVE";
}

type CourseInstanceStatus = "ACTIVE" | "INACTIVE";

interface CourseInstance {
  id: string;
  course: Course;
  teacher: User;
  status: CourseInstanceStatus;
}

const AdminAssignTeacher = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [instances, setInstances] = useState<CourseInstance[]>([]);
  const [instancesError, setInstancesError] = useState<string | null>(null);
  const [instancesLoading, setInstancesLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coursePage, setCoursePage] = useState(0);
  const [teacherPage, setTeacherPage] = useState(0);
  const pageSize = 10;

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

  // reset page khi thay đổi danh sách (phòng khi sau này có filter)
  useEffect(() => {
    setCoursePage(0);
  }, [courses.length]);

  useEffect(() => {
    setTeacherPage(0);
    setSelectedTeacherId("");
  }, [teachers.length, selectedCourseId]);

  // Load course instances để xác định giáo viên đã được gán cho mỗi khóa
  useEffect(() => {
    const loadInstances = async () => {
      if (!selectedCourseId) {
        setInstances([]);
        setInstancesError(null);
        return;
      }

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
            res.data.message ||
              "Không thể tải danh sách lớp học để lọc giáo viên"
          );
          setInstances([]);
          return;
        }

        const all = res.data.data?.content || [];
        const byCourse = all.filter(
          (ci) => ci.course && ci.course.id === selectedCourseId
        );
        setInstances(byCourse);
      } catch (err: unknown) {
        let errorMessage =
          "Đã xảy ra lỗi khi tải danh sách lớp học để lọc giáo viên";
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
        setInstances([]);
      } finally {
        setInstancesLoading(false);
      }
    };

    void loadInstances();
  }, [selectedCourseId]);

  const totalCoursePages = Math.max(
    1,
    Math.ceil(courses.length / pageSize) || 1
  );
  const pagedCourses = useMemo(
    () =>
      courses.slice(coursePage * pageSize, coursePage * pageSize + pageSize),
    [courses, coursePage]
  );

  const pagedTeachers = useMemo(
    () =>
      teachers.slice(teacherPage * pageSize, teacherPage * pageSize + pageSize),
    [teachers, teacherPage]
  );

  // Danh sách giáo viên đã gán cho khóa được chọn
  const assignedTeacherIds = useMemo(() => {
    if (!selectedCourseId) return new Set<string>();
    return new Set(instances.map((ci) => ci.teacher.id));
  }, [instances, selectedCourseId]);

  // Giáo viên khả dụng cho khóa (chưa được gán vào bất kỳ lớp nào của khóa đó)
  const availableTeachers = useMemo(() => {
    if (!selectedCourseId) return teachers;
    return teachers.filter((t) => !assignedTeacherIds.has(t.id));
  }, [teachers, assignedTeacherIds, selectedCourseId]);

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
        description="Chọn khóa học, chọn giáo viên và xác nhận để gán"
      />
      <div className="space-y-4 text-base">
        <PageBreadcrumb pageTitle="Gán giáo viên vào khóa học" />

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
              <p className="text-base font-semibold text-green-800">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-base font-semibold text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-4">
            <AdminLoading message="Đang tải danh sách khóa học và giáo viên..." />
          </div>
        )}

        {/* Steps 1-3: chọn khóa học, chọn giáo viên, bấm submit */}
        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-6 text-base">
            {/* Step 1: chọn khóa học */}
            <div className="rounded-2xl bg-white p-6 shadow-card border-2">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    1. Chọn khóa học
                  </h2>
                  <p className="mt-1 text-base text-gray-600">
                    Chọn một khóa học mà bạn muốn gán giáo viên vào.
                  </p>
                </div>
                <span className="text-base text-gray-500">
                  Tổng: <strong>{courses.length}</strong> khóa học
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-base">
                  <thead className="bg-gray-50 text-base uppercase text-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium tracking-wider">
                        Chọn
                      </th>
                      <th className="px-4 py-3 text-left font-medium tracking-wider">
                        Khóa học
                      </th>
                      <th className="px-4 py-3 text-left font-medium tracking-wider">
                        Mã khóa
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white text-base">
                    {courses.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-4 text-center text-base text-gray-500"
                        >
                          Chưa có khóa học nào đang hoạt động.
                        </td>
                      </tr>
                    )}
                    {pagedCourses.map((course) => (
                      <tr
                        key={course.id}
                        className={`cursor-pointer hover:bg-brand-50 ${
                          selectedCourseId === course.id ? "bg-brand-50" : ""
                        }`}
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="radio"
                            className="h-4 w-4 text-brand-500"
                            checked={selectedCourseId === course.id}
                            onChange={() => {
                              setSelectedCourseId(course.id);
                              setError(null);
                              setSuccess(null);
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 text-base text-gray-900">
                          {course.title}
                        </td>
                        <td className="px-4 py-3 text-base font-mono text-gray-700">
                          {course.code || "Chưa có mã"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {courses.length > 0 && (
                  <AdminPagination
                    page={coursePage}
                    totalPages={totalCoursePages}
                    onPageChange={(p) => setCoursePage(p)}
                  />
                )}
              </div>
            </div>

            {/* Step 2: chọn giáo viên */}
            {selectedCourseId && (
              <div className="rounded-2xl bg-white p-6 shadow-card border-2">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      2. Chọn giáo viên
                    </h2>
                    <p className="mt-1 text-base text-gray-600">
                      Chọn một giáo viên sẽ phụ trách khóa học đã chọn.
                    </p>
                  </div>
                  <span className="text-base text-gray-500">
                    Tổng: <strong>{availableTeachers.length}</strong> giáo viên
                    khả dụng
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-100">
                  {instancesLoading && (
                    <AdminLoading
                      message="Đang tải thông tin gán lớp để lọc giáo viên..."
                      minHeight={80}
                    />
                  )}
                  {instancesError && !instancesLoading && (
                    <div className="border-b border-gray-200 bg-red-50 px-4 py-2 text-base font-semibold text-red-700">
                      {instancesError}
                    </div>
                  )}
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
                      {availableTeachers.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-4 text-center text-base text-gray-500"
                          >
                            Không còn giáo viên nào chưa được gán cho khóa này.
                          </td>
                        </tr>
                      )}
                      {pagedTeachers
                        .filter((t) => !assignedTeacherIds.has(t.id))
                        .map((teacher) => (
                          <tr
                            key={teacher.id}
                            className={`cursor-pointer hover:bg-brand-50 ${
                              selectedTeacherId === teacher.id
                                ? "bg-brand-50"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedTeacherId(teacher.id);
                              setError(null);
                              setSuccess(null);
                            }}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="radio"
                                className="h-4 w-4 text-brand-500"
                                checked={selectedTeacherId === teacher.id}
                                onChange={() => {
                                  setSelectedTeacherId(teacher.id);
                                  setError(null);
                                  setSuccess(null);
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-base text-gray-900">
                              {teacher.lastName} {teacher.firstName}
                            </td>
                            <td className="px-4 py-3 text-base text-gray-700">
                              {teacher.email}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>

                  {availableTeachers.length > 0 && (
                    <AdminPagination
                      page={teacherPage}
                      totalPages={Math.max(
                        1,
                        Math.ceil(availableTeachers.length / pageSize) || 1
                      )}
                      onPageChange={(p) => setTeacherPage(p)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: xác nhận gán */}
            {selectedCourse && selectedTeacher && (
              <div className="rounded-2xl bg-brand-50 border border-brand-200 p-4">
                <h3 className="text-base font-semibold text-brand-900 mb-2">
                  3. Xác nhận thông tin trước khi gán
                </h3>
                <div className="space-y-1 text-base text-gray-700">
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

            <div className="flex justify-end gap-3 pt-2">
              <Link
                to="/admin/courses"
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={submitting || !selectedCourseId || !selectedTeacherId}
                className="rounded-lg bg-brand-500 px-6 py-2.5 text-base font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang gán..." : "Gán giáo viên vào khóa học"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default AdminAssignTeacher;
