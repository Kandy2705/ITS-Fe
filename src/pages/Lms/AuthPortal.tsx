import { useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";

const quickLinks = [
  "Khóa học của tôi",
  "Lộ trình đã mua",
  "Hỗ trợ kỹ thuật",
  "Cộng đồng thảo luận",
];

const AuthPortal = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"student" | "teacher">("student");

  const highlightColor = useMemo(
    () => (role === "student" ? "text-brand-600" : "text-orange-600"),
    [role]
  );

  return (
    <>
      <PageMeta title="LMS Portal" description="Đăng nhập hoặc đăng ký tài khoản" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Truy cập cá nhân hóa</p>
              <h2 className="text-2xl font-semibold text-gray-900">
                Chào mừng quay lại, {role === "student" ? "học viên" : "giảng viên"}!
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1 text-sm font-medium text-gray-600">
              <button
                onClick={() => setRole("student")}
                className={`rounded-full px-3 py-1 transition ${
                  role === "student" ? "bg-white shadow" : ""
                }`}
              >
                Sinh viên
              </button>
              <button
                onClick={() => setRole("teacher")}
                className={`rounded-full px-3 py-1 transition ${
                  role === "teacher" ? "bg-white shadow" : ""
                }`}
              >
                Giảng viên
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-brand-25 p-5">
            <p className="text-sm text-gray-600">Mẹo sử dụng</p>
            <ul className="mt-2 grid gap-2 md:grid-cols-2">
              <li className="flex items-start gap-2 text-sm text-gray-800">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                Giữ đăng nhập để ITS cá nhân hoá gợi ý học tập.
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-800">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                Cập nhật hồ sơ để ITS dự đoán năng lực chính xác hơn.
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-800">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                Theo dõi thông báo tiến độ ngay trên dashboard.
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-800">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                Khôi phục lộ trình nếu ITS dự đoán sai chỉ bằng một cú nhấn.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900">Liên kết nhanh</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {quickLinks.map((item) => (
                <button
                  key={item}
                  className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-5 flex gap-4 rounded-full bg-gray-100 p-1 text-sm font-semibold text-gray-600">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                activeTab === "login" ? "bg-white text-gray-900 shadow" : ""
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                activeTab === "register" ? "bg-white text-gray-900 shadow" : ""
              }`}
            >
              Đăng ký
            </button>
          </div>

          {activeTab === "login" ? (
            <form className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Đăng nhập để đồng bộ tiến độ học.</p>
                <span className={`text-xs font-semibold ${highlightColor}`}>
                  {role === "student" ? "Học viên" : "Giảng viên"}
                </span>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Mật khẩu</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  Nhớ đăng nhập
                </label>
                <button type="button" className="font-semibold text-brand-600">
                  Quên mật khẩu?
                </button>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
              >
                Đăng nhập
              </button>
            </form>
          ) : (
            <form className="space-y-4">
              <p className="text-sm text-gray-600">
                Tạo tài khoản để ITS gợi ý lộ trình, bài học và bài tập phù hợp.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-800">Họ tên</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Vai trò</label>
                  <select className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none">
                    <option>Sinh viên</option>
                    <option>Giảng viên</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-800">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-800">Mật khẩu</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800">Xác nhận</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800"
              >
                Tạo tài khoản
              </button>
              <p className="text-xs text-gray-500">
                Bằng việc tiếp tục, bạn đồng ý với Điều khoản & Chính sách bảo mật. ITS sẽ dùng thông tin
                để cá nhân hóa trải nghiệm học tập.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPortal;
