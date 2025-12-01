import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import AdminPagination from "../../components/common/AdminPagination";
import api from "../../utils/api";
import type { PageResponse } from "../../interfaces/pagination";
import type { User } from "../../interfaces/user";

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

  return (
    <>
      <PageMeta
        title="Quản lý người dùng"
        description="Trang dành cho Admin kiểm soát tài khoản"
      />
      <div className="space-y-4 text-base">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Người dùng hoạt động
            </p>
            <p className="text-3xl font-bold text-brand-700">1,240</p>
            <p className="text-base text-gray-600">
              Tăng 12% so với tuần trước
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Tài khoản bị cảnh báo
            </p>
            <p className="text-3xl font-bold text-orange-600">32</p>
            <p className="text-base text-gray-600">
              Cần kiểm tra hoạt động bất thường
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-sm font-semibold uppercase text-gray-500">
              Yêu cầu phê duyệt
            </p>
            <p className="text-3xl font-bold text-gray-900">7</p>
            <p className="text-base text-gray-600">Đăng ký giảng viên mới</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách người dùng
              </h2>
              <p className="text-base text-gray-600">
                Admin có thể khoá, mở hoặc gửi báo cáo nhanh.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-base font-semibold text-gray-700">
              <button className="rounded-full border border-gray-200 px-3 py-1 transition hover:border-brand-400 hover:bg-brand-50">
                Xuất Excel
              </button>
              <button className="rounded-full border border-gray-200 px-3 py-1 transition hover:border-brand-400 hover:bg-brand-50">
                Gửi báo cáo email
              </button>
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
                            Xem chi tiết
                          </Link>
                          <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                            Khoá/Tạm dừng
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
    </>
  );
};

export default AdminUsers;
