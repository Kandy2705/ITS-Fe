import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminLoading from "../../components/common/AdminLoading";
import api from "../../utils/api";
import type { User } from "../../interfaces/user";

const statusLabels: Record<string, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Đã vô hiệu",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700",
  INACTIVE: "bg-orange-50 text-orange-700",
};

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setUser(res.data.data);
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

    if (error) {
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

    if (!user) {
      return null;
    }

    return (
      <>
        <div className="rounded-2xl bg-white p-6 border-2 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-gray-500">
                Thông tin người dùng
              </p>
              <h1 className="mt-2 text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
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
                Vai trò: {user.role}
              </span>
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <div className="rounded-2xl w-full border-2 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900">
              Thông tin cơ bản
            </h2>
            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Họ tên đầy đủ
                </p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Email
                </p>
                <p className="mt-1 text-base font-medium text-gray-900 break-all">
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Vai trò
                </p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <PageMeta
        title="Chi tiết người dùng"
        description="Xem thông tin chi tiết và trạng thái người dùng trong hệ thống"
      />
      <div className="space-y-4">
        <PageBreadcrumb pageTitle="Chi tiết người dùng" />

        {renderContent()}
      </div>
    </>
  );
};

export default AdminUserDetail;
