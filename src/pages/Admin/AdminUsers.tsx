import PageMeta from "../../components/common/PageMeta";

const users = [
  { name: "Nguyễn Lan", role: "Sinh viên", status: "Hoạt động", courses: 5, email: "lan@example.com" },
  { name: "Trần Minh", role: "Giảng viên", status: "Hoạt động", courses: 3, email: "minh@example.com" },
  { name: "Phạm Hòa", role: "Sinh viên", status: "Cảnh báo", courses: 2, email: "hoa@example.com" },
  { name: "Lê Khánh", role: "Giảng viên", status: "Tạm khóa", courses: 4, email: "khanh@example.com" },
];

const AdminUsers = () => {
  return (
    <>
      <PageMeta title="Quản lý người dùng" description="Trang dành cho Admin kiểm soát tài khoản" />
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">Người dùng hoạt động</p>
            <p className="text-3xl font-bold text-brand-700">1,240</p>
            <p className="text-sm text-gray-600">Tăng 12% so với tuần trước</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">Tài khoản bị cảnh báo</p>
            <p className="text-3xl font-bold text-orange-600">32</p>
            <p className="text-sm text-gray-600">Cần kiểm tra hoạt động bất thường</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">Yêu cầu phê duyệt</p>
            <p className="text-3xl font-bold text-gray-900">7</p>
            <p className="text-sm text-gray-600">Đăng ký giảng viên mới</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Danh sách người dùng</h2>
              <p className="text-sm text-gray-600">Admin có thể khoá, mở hoặc gửi báo cáo nhanh.</p>
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
                  <th className="px-3 py-2">Số khóa</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 font-semibold text-gray-900">{user.name}</td>
                    <td className="px-3 py-2">{user.role}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status === "Hoạt động"
                            ? "bg-success-50 text-success-700"
                            : user.status === "Cảnh báo"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{user.courses}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                          Khoá/Tạm dừng
                        </button>
                        <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                          Gửi báo cáo
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
