import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import api from "../../utils/api";
import type { User } from "../../interfaces/user";
import type { ApiResponse } from "../../interfaces/api";
import type { PageResponse } from "../../interfaces/pagination";

interface Course {
  id: string;
  title: string;
  code: string | null;
  description: string | null;
  credit: string | null;
  status: "ACTIVE" | "INACTIVE";
}

type CourseInstanceStatus = "ACTIVE" | "INACTIVE";

interface CourseInstance {
  id: string;
  course: Course;
  teacher: User;
  status: CourseInstanceStatus;
}

const statusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  INACTIVE: "bg-orange-50 text-orange-700",
};

const AdminCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instances, setInstances] = useState<CourseInstance[]>([]);
  const [loadingInstances, setLoadingInstances] = useState(false);
  const [instancesError, setInstancesError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  // Tập giáo viên đã được gán vào bất kỳ lớp (CourseInstance) nào của khóa này
  const assignedTeacherIds = useMemo(() => {
    if (!id) return new Set<string>();
    return new Set(instances.map((ci) => ci.teacher.id));
  }, [instances, id]);

  // Giáo viên khả dụng: ACTIVE và chưa được gán vào khóa này
  const availableTeachers = useMemo(
    () => teachers.filter((t) => !assignedTeacherIds.has(t.id)),
    [teachers, assignedTeacherIds]
  );

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID khóa học");
      return;
    }

    const fetchCourseDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/learning-management/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
        } else {
          setError(res.data.message || "Không thể tải thông tin khóa học");
        }
      } catch (err: unknown) {
        let errorMessage = "Đã xảy ra lỗi khi tải thông tin khóa học";
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            errorMessage = "Khóa học không tồn tại";
          } else {
            errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Đã xảy ra lỗi khi tải thông tin khóa học";
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  useEffect(() => {
    const fetchInstances = async () => {
      if (!id) return;

      setLoadingInstances(true);
      setInstancesError(null);

      try {
        const res = await api.get<ApiResponse<PageResponse<CourseInstance>>>(
          "/learning-management/courses-instance/getDetailsList",
          {
            params: {
              page: 0,
              size: 20,
            },
          }
        );

        if (!res.data.success) {
          setInstancesError(
            res.data.message ||
              "Không thể tải danh sách lớp học (courseInstance)"
          );
          return;
        }

        const allInstances = res.data.data?.content || [];
        const filtered = allInstances.filter((ci) => ci.course?.id === id);
        setInstances(filtered);
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
        setLoadingInstances(false);
      }
    };

    void fetchInstances();
  }, [id]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/users", {
          params: {
            role: "TEACHER",
            status: "ACTIVE",
            page: 0,
            size: 100,
          },
        });

        if (res.data.success) {
          setTeachers(res.data.data.content || []);
        }
      } catch {
        // ignore loading teachers error, assigning will fail explicitly
      }
    };

    void fetchTeachers();
  }, []);

  const handleAssignTeacher = async () => {
    if (!id || !selectedTeacherId) {
      setAssignError("Vui lòng chọn giáo viên để gán vào khóa học");
      return;
    }

    setAssignError(null);
    setAssignSuccess(null);
    setAssigning(true);

    try {
      const res = await api.post("/learning-management/assign", null, {
        params: {
          courseId: id,
          teacherId: selectedTeacherId,
        },
      });

      if (!res.data.success) {
        setAssignError(
          res.data.message || "Không thể gán giáo viên vào khóa học"
        );
        return;
      }

      const teacher = teachers.find((t) => t.id === selectedTeacherId);
      setAssignSuccess(
        `Đã gán giáo viên ${teacher?.firstName ?? ""} ${
          teacher?.lastName ?? ""
        } vào khóa học thành công.`
      );
      setSelectedTeacherId("");

      // Reload course instances to reflect new assignment
      if (id) {
        try {
          const ciRes = await api.get<
            ApiResponse<PageResponse<CourseInstance>>
          >("/learning-management/courses-instance/getDetailsList", {
            params: {
              page: 0,
              size: 20,
            },
          });

          if (ciRes.data.success) {
            const allInstances = ciRes.data.data?.content || [];
            const filtered = allInstances.filter((ci) => ci.course?.id === id);
            setInstances(filtered);
          }
        } catch {
          // ignore reload error, instances list will be updated next time
        }
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
      setAssignError(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!id) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      return;
    }

    try {
      const res = await api.delete(`/learning-management/courses/${id}`);
      if (res.data.success) {
        alert("Xóa khóa học thành công");
        navigate("/admin/courses");
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

  if (loading) {
    return (
      <>
        <PageMeta
          title="Chi tiết khóa học"
          description="Xem thông tin chi tiết khóa học"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="text-base font-medium text-gray-700">
              Đang tải thông tin khóa học...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta title="Lỗi" description="Đã xảy ra lỗi khi tải thông tin" />
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{error}</h3>
                <p className="mt-2 text-base text-gray-600">
                  Không thể tải thông tin khóa học
                </p>
              </div>
              <Link
                to="/admin/courses"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <>
      <PageMeta
        title={`Chi tiết khóa học - ${course.title}`}
        description="Xem thông tin chi tiết khóa học"
      />
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <nav className="flex text-sm text-gray-600">
            <Link to="/admin" className="hover:text-brand-600">
              Admin
            </Link>
            <span className="mx-2">/</span>
            <Link to="/admin/courses" className="hover:text-brand-600">
              Danh sách khóa học
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Chi tiết</span>
          </nav>
        </div>

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {course.title}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    statusColors[course.status] || statusColors["INACTIVE"]
                  }`}
                >
                  {statusLabels[course.status] || course.status}
                </span>
              </div>
              {course.code && (
                <p className="mt-2 font-mono text-sm text-gray-600">
                  Mã khóa học: {course.code}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/admin/courses"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Quay lại
              </Link>
              <button
                onClick={handleDeleteCourse}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
              >
                Xóa khóa học
              </button>
            </div>
          </div>
        </div>

        {/* Course Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900">
              Thông tin cơ bản
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Tên khóa học
                </p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {course.title}
                </p>
              </div>
              {course.code && (
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Mã khóa học
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-900">
                    {course.code}
                  </p>
                </div>
              )}
              {course.credit && (
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Tín chỉ
                  </p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {course.credit}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Trạng thái
                </p>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      statusColors[course.status] || statusColors["INACTIVE"]
                    }`}
                  >
                    {statusLabels[course.status] || course.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900">
              Mô tả khóa học
            </h2>
            <div className="mt-4">
              {course.description ? (
                <p className="whitespace-pre-wrap text-base text-gray-700">
                  {course.description}
                </p>
              ) : (
                <p className="text-base text-gray-400 italic">
                  Chưa có mô tả cho khóa học này
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Course ID Info */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">
            Thông tin kỹ thuật
          </h2>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-gray-500">
              ID khóa học
            </p>
            <p className="mt-1 font-mono text-sm text-gray-600">{course.id}</p>
          </div>
        </div>

        {/* Course instances & teachers */}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          {/* Assign teacher to this course (table) */}
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Thêm giảng viên vào khóa học này
            </h3>
            <p className="mt-1 text-base text-gray-600">
              Chọn một giảng viên để tạo lớp học (CourseInstance) mới cho khóa.
            </p>

            {assignSuccess && (
              <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-base font-semibold text-green-800">
                {assignSuccess}
              </div>
            )}

            {assignError && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-base font-semibold text-red-800">
                {assignError}
              </div>
            )}

            <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Chọn
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Họ tên
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {availableTeachers.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-center text-xs text-gray-500"
                      >
                        Tất cả giảng viên đang hoạt động đã được gán cho khóa
                        học này.
                      </td>
                    </tr>
                  )}
                  {availableTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className={`cursor-pointer hover:bg-brand-50 ${
                        selectedTeacherId === teacher.id ? "bg-brand-50" : ""
                      }`}
                      onClick={() => {
                        setSelectedTeacherId(teacher.id);
                        setAssignError(null);
                        setAssignSuccess(null);
                      }}
                    >
                      <td className="px-4 py-2">
                        <input
                          type="radio"
                          className="h-4 w-4 text-brand-500"
                          checked={selectedTeacherId === teacher.id}
                          onChange={() => {
                            setSelectedTeacherId(teacher.id);
                            setAssignError(null);
                            setAssignSuccess(null);
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {teacher.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleAssignTeacher}
                disabled={assigning || !selectedTeacherId}
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assigning ? "Đang gán..." : "Gán giảng viên"}
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Danh sách lớp học (CourseInstance) của khóa
              </h2>
              <span className="text-sm text-gray-500">
                Tổng: <strong>{instances.length}</strong> lớp
              </span>
            </div>

            {loadingInstances && (
              <div className="mt-3 flex items-center justify-center py-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
                  <p className="text-base font-medium text-gray-700">
                    Đang tải danh sách lớp học...
                  </p>
                </div>
              </div>
            )}

            {instancesError && !loadingInstances && (
              <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-base text-red-700">
                {instancesError}
              </div>
            )}

            {!loadingInstances && !instancesError && (
              <div className="mt-3 space-y-2">
                {instances.length === 0 && (
                  <p className="text-base text-gray-500">
                    Chưa có lớp học (courseInstance) nào cho khóa này.
                  </p>
                )}

                {instances.map((ci) => (
                  <Link
                    key={ci.id}
                    to={`/admin/course-instances/${ci.id}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-3 transition hover:border-brand-200 hover:bg-brand-50"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-mono text-gray-500">
                        ID lớp: {ci.id}
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {ci.course.title}
                        {ci.course.code && (
                          <span className="ml-1 text-sm text-gray-500">
                            (Mã: {ci.course.code})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-right text-base text-gray-800">
                      <p className="font-semibold">
                        {ci.teacher.firstName} {ci.teacher.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ci.teacher.email}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCourseDetail;
