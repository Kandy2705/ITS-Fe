import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminLoading from "../../components/common/AdminLoading";
import api from "../../utils/api";
import type { User, UserRole, UserStatus } from "../../interfaces/user";

type EditableUserFields = Pick<
  User,
  "firstName" | "lastName" | "email" | "role" | "status"
>;

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "TEACHER", label: "Giảng viên" },
  { value: "STUDENT", label: "Sinh viên" },
];

const statusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Đã vô hiệu",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  INACTIVE: "bg-orange-50 text-orange-700",
};

const AdminUserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<EditableUserFields | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setError("Không tìm thấy ID người dùng");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await api.get(`/users/${id}`);
        if (res.data.success) {
          const data: User = res.data.data;
          setUser(data);
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            status: data.status,
          });
        } else {
          setError(res.data.message || "Không thể tải thông tin người dùng");
        }
      } catch (err: unknown) {
        let errorMessage = "Đã xảy ra lỗi khi tải thông tin người dùng";
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            errorMessage = "Người dùng không tồn tại hoặc đã bị xóa";
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

    void loadUser();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "status" ? (value as UserStatus) : (value as typeof value),
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
      };

      const res = await api.patch(`/users/${id}`, payload);
      if (res.data.success) {
        const updated: User = res.data.data;
        setUser(updated);
        setFormData({
          firstName: updated.firstName,
          lastName: updated.lastName,
          email: updated.email,
          role: updated.role,
          status: updated.status,
        });
        setSuccessMessage("Cập nhật thông tin người dùng thành công.");
      } else {
        setError(res.data.message || "Không thể cập nhật thông tin người dùng");
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi cập nhật thông tin người dùng";
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
    if (loading && !user) {
      return (
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <AdminLoading
            message="Đang tải thông tin người dùng..."
            minHeight={220}
          />
        </div>
      );
    }

    if (error && !user) {
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
                Vui lòng thử lại hoặc quay về danh sách người dùng.
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
                to="/admin/users"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Về danh sách
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (!user || !formData) {
      return null;
    }

    return (
      <>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500">
                Chỉnh sửa người dùng
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                {user.lastName} {user.firstName}
              </h1>
              <p className="mt-1 text-base text-gray-600">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColors[user.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {statusLabels[user.status] || user.status}
              </span>
              <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                Vai trò hiện tại: {user.role}
              </span>
              <button
                type="button"
                onClick={() => navigate(`/admin/users/${user.id}`)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">
            Cập nhật thông tin cơ bản
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">
                Họ
              </label>
              <input
                type="text"
                name="lastName"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={formData.lastName}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">
                Tên
              </label>
              <input
                type="text"
                name="firstName"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={formData.firstName}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={formData.email}
                onChange={handleChange}
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500">
                Vai trò
              </label>
              <select
                name="role"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                value={formData.role}
                onChange={handleChange}
                disabled={saving}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
        title="Chỉnh sửa người dùng"
        description="Cập nhật thông tin cá nhân và vai trò người dùng trong hệ thống"
      />
      <div className="space-y-4">
        <PageBreadcrumb pageTitle="Chỉnh sửa người dùng" />

        {renderContent()}
      </div>
    </>
  );
};

export default AdminUserEdit;
