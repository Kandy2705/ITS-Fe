import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AdminPagination from "../../components/common/AdminPagination";
import { Modal } from "../../components/ui/modal";
import api from "../../utils/api";
import type { PageResponse } from "../../interfaces/pagination";
import type { User } from "../../interfaces/user";
import { Eye, Pencil, Lock, LockOpen } from "lucide-react";

const PAGE_SIZE = 5;

const ROLE_OPTIONS = [
  { value: "", label: "Tất cả vai trò" },
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "TEACHER", label: "Giảng viên" },
  { value: "STUDENT", label: "Sinh viên" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
];

const AdminUsers = () => {
  const [userList, setUserList] = useState<PageResponse<User> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  const totalUsers = userList?.totalElements ?? 0;
  const totalTeachers =
    userList?.content.filter((user) => user.role === "TEACHER").length ?? 0;
  const totalStudents =
    userList?.content.filter((user) => user.role === "STUDENT").length ?? 0;

  const fetchData = useCallback(
    async (page: number = 0) => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = {
          page,
          size: PAGE_SIZE,
        };

        const email = searchKeyword.trim();
        const role = roleFilter;
        const status = statusFilter;

        if (email) {
          params.email = email;
        }

        if (role) {
          params.role = role;
        }

        if (status) {
          params.status = status;
        }

        const res = await api.get("/users", {
          params,
        });
        setUserList(res.data.data);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [roleFilter, searchKeyword, statusFilter]
  );

  // Debounce search input so results update "live" without layout flicker
  useEffect(() => {
    const trimmed = searchInput.trim();
    const handle = setTimeout(() => {
      setSearchKeyword(trimmed);
      setCurrentPage(0);
    }, 400);

    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    void fetchData(0);
  }, [fetchData]);

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchKeyword("");
    setRoleFilter("");
    setStatusFilter("");
  };

  const handleToggleUserStatus = async (user: User) => {
    if (!user.id) return;

    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setTogglingUserId(user.id);
    try {
      const res = await api.patch(`/users/${user.id}`, {
        status: nextStatus,
      });

      if (res.data?.success) {
        const updated: User = res.data.data;
        setUserList((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((u) =>
                  u.id === user.id ? { ...u, ...updated } : u
                ),
              }
            : prev
        );
      } else {
        alert(res.data?.message || "Không thể cập nhật trạng thái người dùng");
      }
    } catch (error: unknown) {
      let message = "Đã xảy ra lỗi khi cập nhật trạng thái người dùng";
      if (axios.isAxiosError(error)) {
        if (error.response?.data && typeof error.response.data === "object") {
          const data = error.response.data as { message?: string };
          message = data.message || error.message || message;
        } else {
          message = error.message || message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      alert(message);
      console.error("Error toggling user status:", error);
    } finally {
      setTogglingUserId(null);
    }
  };

  return (
    <>
      <PageMeta
        title="Quản lý người dùng"
        description="Trang dành cho Admin kiểm soát tài khoản"
      />
      <PageBreadcrumb pageTitle="Quản lý người dùng" />
      <div className="space-y-4 text-base">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-card border-2">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Tổng số người dùng
            </p>
            <p className="text-3xl font-bold text-brand-700">
              {totalUsers.toLocaleString("vi-VN")}
            </p>
            <p className="text-base text-gray-600">
              Tất cả tài khoản trong hệ thống
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card border-2">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Số lượng giảng viên
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {totalTeachers.toLocaleString("vi-VN")}
            </p>
            <p className="text-base text-gray-600">
              Tài khoản có vai trò giảng viên
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card border-2">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Số lượng sinh viên
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {totalStudents.toLocaleString("vi-VN")}
            </p>
            <p className="text-base text-gray-600">
              Tài khoản có vai trò sinh viên (trên trang hiện tại)
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card border-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách người dùng
              </h2>
              <p className="text-base text-gray-600">
                Admin có thể tạo mới, khoá hoặc mở tài khoản người dùng.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              <Link
                to="/admin/users/new"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
              >
                <span className="h-4 w-4 rounded-full bg-white text-brand-500 flex items-center justify-center text-xs">
                  +
                </span>
                Tạo người dùng mới
              </Link>
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <form
                className="flex flex-1 flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Explicit submit just forces immediate refresh with current keyword
                  void fetchData(0);
                }}
              >
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600">
                    Từ khóa tìm kiếm
                  </label>
                  <input
                    type="text"
                    placeholder="Tìm tên, email hoặc vai trò..."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-brand-500 px-4 py-2 text-base font-semibold text-white hover:bg-brand-600"
                  >
                    Áp dụng
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleResetFilters();
                    }}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-base font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Xóa lọc
                  </button>
                </div>
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-sm font-semibold uppercase text-gray-500">
                  Vai trò
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold uppercase text-gray-500">
                  Trạng thái
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                Đang tải dữ liệu người dùng...
              </div>
            )}

            {(searchKeyword || roleFilter || statusFilter) && (
              <div className="text-sm text-gray-600">
                Đang lọc theo:{" "}
                <span className="font-semibold text-gray-900">
                  {[
                    searchKeyword ? `Từ khóa: "${searchKeyword}"` : null,
                    roleFilter
                      ? `Vai trò: ${
                          ROLE_OPTIONS.find((r) => r.value === roleFilter)
                            ?.label || roleFilter
                        }`
                      : null,
                    statusFilter
                      ? `Trạng thái: ${
                          STATUS_OPTIONS.find((s) => s.value === statusFilter)
                            ?.label || statusFilter
                        }`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-base text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-sm font-semibold uppercase text-gray-500">
                  <th className="px-3 py-2">Họ tên</th>
                  <th className="px-3 py-2">Vai trò</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  {/* <th className="px-3 py-2">Số khóa</th> */}
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-base">
                {userList &&
                  userList.content.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 font-semibold text-gray-900">
                        {user.firstName + " " + user.lastName}
                      </td>
                      <td className="px-3 py-2">{user.role}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            user.status === "ACTIVE" || !user.status
                              ? "bg-success-50 text-success-700"
                              : user.status === "INACTIVE"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status ?? "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-3 py-2">{user.email}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2 text-sm font-semibold">
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50"
                          >
                            <Eye />
                          </Link>
                          <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50"
                          >
                            <Pencil />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setPendingUser(user)}
                            disabled={loading || togglingUserId === user.id}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {user.status === "ACTIVE" ? <Lock /> : <LockOpen />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {userList && userList.content.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      Không tìm thấy người dùng phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {userList && userList.totalPages > 1 && (
            <div className="mt-6">
              <AdminPagination
                page={currentPage}
                totalPages={userList.totalPages}
                onPageChange={(p) => fetchData(p)}
                disabled={loading}
              />
            </div>
          )}

          {userList && (
            <div className="mt-4 text-base text-gray-600">
              Hiển thị {userList.numberOfElements} trong tổng số{" "}
              {userList.totalElements} người dùng (Trang {userList.number + 1} /{" "}
              {userList.totalPages})
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!pendingUser}
        onClose={() => setPendingUser(null)}
        className="max-w-md w-full mx-4 p-6"
      >
        {pendingUser && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {pendingUser.status === "ACTIVE"
                ? "Khoá / tạm dừng tài khoản"
                : "Kích hoạt lại tài khoản"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Bạn có chắc chắn muốn{" "}
              {pendingUser.status === "ACTIVE"
                ? "khoá / tạm dừng"
                : "kích hoạt lại"}{" "}
              tài khoản của người dùng{" "}
              <span className="font-semibold text-gray-900">
                {pendingUser.firstName} {pendingUser.lastName}
              </span>{" "}
              ({pendingUser.email})?
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Thao tác này sẽ thay đổi khả năng đăng nhập và truy cập hệ thống
              của người dùng.
            </p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingUser(null)}
                disabled={togglingUserId === pendingUser.id}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!pendingUser) return;
                  void handleToggleUserStatus(pendingUser);
                  setPendingUser(null);
                }}
                disabled={togglingUserId === pendingUser.id}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {togglingUserId === pendingUser.id
                  ? "Đang xử lý..."
                  : pendingUser.status === "ACTIVE"
                  ? "Xác nhận khoá"
                  : "Xác nhận kích hoạt"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminUsers;
