import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import api from "../../utils/api";

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

const AdminCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <p className="text-sm font-medium text-gray-700">
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
                <p className="mt-2 text-sm text-gray-600">
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
                <p className="mt-1 text-sm font-medium text-gray-900">
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
                  <p className="mt-1 text-sm font-medium text-gray-900">
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
                <p className="whitespace-pre-wrap text-sm text-gray-700">
                  {course.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
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
            <p className="mt-1 font-mono text-xs text-gray-600">{course.id}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCourseDetail;
