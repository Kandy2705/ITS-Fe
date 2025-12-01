import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import api from "../../utils/api";
import type { UserRole, UserStatus } from "../../interfaces/user";

interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "TEACHER", label: "Giảng viên" },
  { value: "STUDENT", label: "Sinh viên" },
];

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
];

const AdminUserCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT",
    status: "ACTIVE",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmed = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    if (
      !trimmed.firstName ||
      !trimmed.lastName ||
      !trimmed.email ||
      !trimmed.password
    ) {
      setError("Vui lòng nhập đầy đủ Họ, Tên, Email và Mật khẩu.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        firstName: trimmed.firstName,
        lastName: trimmed.lastName,
        email: trimmed.email,
        password: trimmed.password,
        role: formData.role,
        status: formData.status,
      };

      const res = await api.post("/users/register", payload);

      if (res.data?.success) {
        navigate("/admin/users");
      } else {
        setError(res.data?.message || "Không thể tạo người dùng mới.");
      }
    } catch (err: unknown) {
      let message = "Đã xảy ra lỗi khi tạo người dùng.";
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
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Tạo người dùng mới"
        description="Trang dành cho Admin tạo tài khoản người dùng mới"
      />
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-card">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
            <Link to="/admin" className="hover:text-brand-600">
              Admin
            </Link>
            <span className="mx-1">/</span>
            <Link to="/admin/users" className="hover:text-brand-600">
              Quản lý người dùng
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900">Tạo mới</span>
          </nav>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Tạo người dùng mới
              </h1>
              <p className="mt-1 text-base text-gray-600">
                Nhập các thông tin cơ bản để tạo tài khoản người dùng trong hệ
                thống.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Quay lại danh sách
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Họ *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Nguyễn"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Tên *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Văn A"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Mật khẩu *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Nhập mật khẩu tạm thời"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Vai trò
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={submitting}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Đang tạo..." : "Tạo người dùng"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminUserCreate;
