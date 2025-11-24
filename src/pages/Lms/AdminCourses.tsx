import PageMeta from "../../components/common/PageMeta";

const courseRows = [
  {
    name: "Lập trình Web nâng cao",
    owner: "Lê Mỹ An",
    learners: 320,
    status: "Đang tuyển",
    updated: "Hôm nay",
  },
  {
    name: "Nhập môn AI",
    owner: "Nguyễn Huy",
    learners: 210,
    status: "Đang học",
    updated: "Hôm qua",
  },
  {
    name: "Phân tích dữ liệu",
    owner: "Trần Minh",
    learners: 145,
    status: "Tạm dừng",
    updated: "3 ngày trước",
  },
];

const AdminCourses = () => {
  return (
    <>
      <PageMeta title="Quản lý khóa học" description="Admin quản lý toàn bộ khoá học trên hệ thống" />
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">Tổng khoá học</p>
            <p className="text-3xl font-bold text-brand-700">186</p>
            <p className="text-sm text-gray-600">Bao gồm cả lộ trình ITS</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">Cần duyệt</p>
            <p className="text-3xl font-bold text-orange-600">14</p>
            <p className="text-sm text-gray-600">Khoá mới do giảng viên gửi lên</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase text-gray-500">Báo cáo vi phạm</p>
            <p className="text-3xl font-bold text-gray-900">4</p>
            <p className="text-sm text-gray-600">Cần kiểm tra nội dung</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Danh sách khoá học</h2>
              <p className="text-sm text-gray-600">Quản trị nhanh trạng thái, báo cáo và xuất dữ liệu.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm font-semibold text-gray-700">
              <button className="rounded-full border border-gray-200 px-3 py-1 transition hover:border-brand-400 hover:bg-brand-50">
                Thêm khoá học
              </button>
              <button className="rounded-full border border-gray-200 px-3 py-1 transition hover:border-brand-400 hover:bg-brand-50">
                Xuất PDF
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
                  <th className="px-3 py-2">Tên khoá</th>
                  <th className="px-3 py-2">Giảng viên</th>
                  <th className="px-3 py-2">Học viên</th>
                  <th className="px-3 py-2">Trạng thái</th>
                  <th className="px-3 py-2">Cập nhật</th>
                  <th className="px-3 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {courseRows.map((course) => (
                  <tr key={course.name} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 font-semibold text-gray-900">{course.name}</td>
                    <td className="px-3 py-2">{course.owner}</td>
                    <td className="px-3 py-2">{course.learners}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          course.status === "Đang học"
                            ? "bg-success-50 text-success-700"
                            : course.status === "Đang tuyển"
                              ? "bg-brand-50 text-brand-700"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{course.updated}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                          Xem chi tiết
                        </button>
                        <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                          Tạm dừng
                        </button>
                        <button className="rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                          Xuất báo cáo
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

export default AdminCourses;
