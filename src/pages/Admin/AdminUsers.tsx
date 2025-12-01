import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import PageMeta from "../../components/common/PageMeta";
import api from "../../utils/api";
import { PageResponse } from "../../interfaces/pagination";
import { User } from "../../interfaces/user";

const PAGE_SIZE = 5;

const AdminUsers = () => {
  const [userList, setUserList] = useState<PageResponse<User> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (page: number = 0) => {
    setLoading(true);
    try {
      const res = await api.get("/users", {
        params: {
          page,
          size: PAGE_SIZE,
        },
      });
      setUserList(res.data.data);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected;
    fetchData(newPage);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-xl">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
            <p className="text-sm font-medium text-gray-700">
              Đang tải dữ liệu, vui lòng chờ...
            </p>
          </div>
        </div>
      )}

      <PageMeta
        title="Quản lý người dùng"
        description="Trang dành cho Admin kiểm soát tài khoản"
      />
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Người dùng hoạt động
            </p>
            <p className="text-3xl font-bold text-brand-700">1,240</p>
            <p className="text-sm text-gray-600">Tăng 12% so với tuần trước</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Tài khoản bị cảnh báo
            </p>
            <p className="text-3xl font-bold text-orange-600">32</p>
            <p className="text-sm text-gray-600">
              Cần kiểm tra hoạt động bất thường
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Yêu cầu phê duyệt
            </p>
            <p className="text-3xl font-bold text-gray-900">7</p>
            <p className="text-sm text-gray-600">Đăng ký giảng viên mới</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách người dùng
              </h2>
              <p className="text-sm text-gray-600">
                Admin có thể khoá, mở hoặc gửi báo cáo nhanh.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-semibold text-gray-700">
              <button className="rounded-full border border-gray-200 px-3 py-1 transition hover:border-brand-400 hover:bg-brand-50">
                Xuất Excel
              </button>
              <button className="rounded-full border border-gray-200 px-3 py-1 transition hover:border-brand-400 hover:bg-brand-50">
                Gửi báo cáo email
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                  <th className="px-3 py-2">Họ tên</th>
                  <th className="px-3 py-2">Vai trò</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  {/* <th className="px-3 py-2">Số khóa</th> */}
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
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
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
                        <div className="flex flex-wrap gap-2 text-xs font-semibold">
                          <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                            Khoá/Tạm dừng
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {userList && userList.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center">
              <ReactPaginate
                previousLabel={
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700">
                    Trước
                  </span>
                }
                nextLabel={
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700">
                    Sau
                  </span>
                }
                breakLabel={
                  <span className="px-2 text-sm text-gray-500">...</span>
                }
                pageCount={userList.totalPages}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageChange}
                forcePage={currentPage}
                containerClassName="flex items-center gap-1"
                pageLinkClassName="px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition min-w-[40px] text-center"
                previousClassName="mr-2"
                previousLinkClassName="px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition"
                nextClassName="ml-2"
                nextLinkClassName="px-3 py-2 text-sm font-semibold text-gray-700 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition"
                breakLinkClassName="px-2 py-2 text-sm text-gray-500"
                activeLinkClassName="bg-brand-500 text-white border-brand-500 hover:bg-brand-600 hover:border-brand-600"
                disabledClassName="opacity-50 cursor-not-allowed"
                disabledLinkClassName="cursor-not-allowed hover:bg-transparent hover:border-gray-200"
              />
            </div>
          )}

          {userList && (
            <div className="mt-4 text-sm text-gray-600">
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
