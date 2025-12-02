import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";
import type { ApiResponse } from "../../interfaces/api";

interface Course {
  id: string;
  title: string;
  code: string | null;
  description: string | null;
  credit: number | null;
  status: "ACTIVE" | "INACTIVE";
}

type CourseFormData = {
  title: string;
  code: string;
  description: string;
  credit: string;
  status: "ACTIVE" | "INACTIVE";
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  INACTIVE: "bg-orange-50 text-orange-700",
};

const AdminCourseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) {
        setError("Không tìm thấy ID khóa học");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await api.get<ApiResponse<Course>>(
          `/learning-management/courses/${id}`
        );

        if (res.data.success) {
          const data = res.data.data;
          setCourse(data);
          setFormData({
            title: data.title ?? "",
            code: data.code ?? "",
            description: data.description ?? "",
            credit: data.credit != null ? String(data.credit) : "",
            status: data.status,
          });
        } else {
          setError(res.data.message || "Không thể tải thông tin khóa học");
        }
      } catch (err: unknown) {
        let errorMessage = "Đã xảy ra lỗi khi tải thông tin khóa học";
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            errorMessage = "Khóa học không tồn tại hoặc đã bị xóa";
          } else if (
            err.response?.data &&
            typeof err.response.data === "object"
          ) {
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

    void loadCourse();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;

    if (name === "credit") {
      // chỉ cho phép số hoặc rỗng
      if (value === "" || /^[0-9]+$/.test(value)) {
        setFormData({
          ...formData,
          credit: value,
        });
      }
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: formData.title.trim(),
        code: formData.code.trim() || null,
        description: formData.description.trim() || null,
        credit:
          formData.credit.trim() === ""
            ? null
            : Number.parseInt(formData.credit.trim(), 10),
        status: formData.status,
      };

      const res = await api.patch<ApiResponse<Course>>(
        `/learning-management/courses/${id}`,
        payload
      );

      if (res.data.success) {
        const updated = res.data.data;
        setCourse(updated);
        setFormData({
          title: updated.title ?? "",
          code: updated.code ?? "",
          description: updated.description ?? "",
          credit: updated.credit != null ? String(updated.credit) : "",
          status: updated.status,
        });
        setSuccessMessage("Cập nhật khóa học thành công.");
        // điều hướng về trang chi tiết sau một chút
        setTimeout(() => {
          navigate(`/admin/courses/${updated.id}`);
        }, 800);
      } else {
        setError(res.data.message || "Không thể cập nhật khóa học");
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi cập nhật khóa học";
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
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading && !course) {
      return (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
              <p className="text-base font-medium text-gray-700">
                Đang tải thông tin khóa học...
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (error && !course) {
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{error}</h2>
              <p className="mt-1 text-sm text-gray-600">
                Vui lòng thử lại hoặc quay về danh sách khóa học.
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
              <Link
                to="/admin/courses"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Về danh sách
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (!course || !formData) {
      return null;
    }

    return (
      <>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500">
                Chỉnh sửa khóa học
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                {course.title}
              </h1>
              {course.code && (
                <p className="mt-1 font-mono text-sm text-gray-600">
                  Mã khóa học: {course.code}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColors[course.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {statusLabels[course.status] || course.status}
              </span>
              <button
                type="button"
                onClick={() => navigate(`/admin/courses/${course.id}`)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">
            Cập nhật thông tin khóa học
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">
                Tên khóa học
              </label>
              <input
                type="text"
                name="title"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={formData.title}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">
                Mã khóa học
              </label>
              <input
                type="text"
                name="code"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={formData.code}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">
                Mô tả
              </label>
              <textarea
                name="description"
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Tín chỉ
                </label>
                <input
                  type="text"
                  name="credit"
                  inputMode="numeric"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  value={formData.credit}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Ví dụ: 3"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Trạng thái
                </label>
                <select
                  name="status"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="INACTIVE">Ngừng hoạt động</option>
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  return (
    <>
      <PageMeta
        title="Chỉnh sửa khóa học"
        description="Cập nhật thông tin khóa học trong hệ thống"
      />
      <div className="space-y-4">
        <PageBreadcrumb pageTitle="Chỉnh sửa khóa học" />

        {renderContent()}
      </div>
    </>
  );
};

export default AdminCourseEdit;
