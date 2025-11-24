import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

type ToggleKey = "published" | "upcoming" | "featured" | "disableEnroll" | "paid" | "completionCert" | "paidCert";

const colorPresets = [
  { name: "Ocean", value: "#1E90FF" },
  { name: "Sunset", value: "#F59E0B" },
  { name: "Forest", value: "#16A34A" },
  { name: "Rose", value: "#EC4899" },
  { name: "Slate", value: "#0F172A" },
];

const NewCourse = () => {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    published: false,
    upcoming: false,
    featured: false,
    disableEnroll: false,
    paid: false,
    completionCert: true,
    paidCert: false,
  });

  const handleToggle = (key: ToggleKey) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <PageMeta title="Tạo khoá học mới" description="Biểu mẫu thêm khoá học với đầy đủ thông tin và tuỳ chọn" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-6 shadow-card md:flex-row md:items-center">
          <div>
            <p className="text-sm text-gray-500">Courses / New Course</p>
            <h1 className="text-2xl font-semibold text-gray-900">Tạo mới khoá học</h1>
          </div>
          <button className="h-10 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white shadow hover:bg-gray-700">
            Lưu khoá học
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Chi tiết</h2>
                <span className="text-xs font-semibold text-brand-600">Bắt buộc</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Tiêu đề *
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Lập trình Web nâng cao"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Danh mục
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Web, AI, Data..."
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Giảng viên *
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Tên người phụ trách"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Tags
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Thêm từ khoá, nhấn enter"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2 text-sm font-semibold text-gray-800">
                  Ảnh khoá học
                  <div className="flex items-center gap-4">
                    <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                      Upload
                    </button>
                    <p className="text-sm font-normal text-gray-600">Ảnh xuất hiện ở thẻ khoá học</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm font-semibold text-gray-800">
                  Màu chủ đạo
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.value}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50"
                      >
                        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.value }} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Giới thiệu khoá học</h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Mở đầu ngắn
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Một câu giới thiệu ngắn gọn"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Mô tả chi tiết *
                  <textarea
                    className="min-h-[140px] w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Giới thiệu nội dung, yêu cầu nền tảng, kết quả đạt được..."
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Video giới thiệu
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Link Youtube ngắn giới thiệu khoá"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Nội dung liên quan
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Ví dụ: React Hooks, Express API, DevOps..."
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Giá & chứng chỉ</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["paid", "completionCert", "paidCert"].map((key) => {
                  const labelMap: Record<ToggleKey, string> = {
                    paid: "Khoá học trả phí",
                    completionCert: "Chứng chỉ hoàn thành",
                    paidCert: "Chứng chỉ có phí",
                    published: "Công khai",
                    upcoming: "Sắp ra mắt",
                    featured: "Đề xuất",
                    disableEnroll: "Khoá đăng ký",
                  };
                  return (
                    <label key={key} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        checked={toggles[key as ToggleKey]}
                        onChange={() => handleToggle(key as ToggleKey)}
                      />
                      {labelMap[key as ToggleKey]}
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Meta Tags</h2>
              <div className="mt-4 space-y-4">
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Meta Description
                  <textarea
                    className="min-h-[80px] w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Tóm tắt nội dung cho SEO"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Meta Keywords
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Từ khoá cách nhau bởi dấu phẩy"
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Cài đặt</h2>
              <div className="mt-4 space-y-3 text-sm font-semibold text-gray-800">
                {(
                  [
                    { key: "published", label: "Published" },
                    { key: "upcoming", label: "Upcoming" },
                    { key: "featured", label: "Featured" },
                    { key: "disableEnroll", label: "Disable Self Enrollment" },
                  ] as const
                ).map((item) => (
                  <label key={item.key} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      checked={toggles[item.key]}
                      onChange={() => handleToggle(item.key)}
                    />
                  </label>
                ))}
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Ngày phát hành
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Xem trước</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Thẻ khoá học</p>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                    CO
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Tên khoá học</p>
                    <p className="text-xs text-gray-600">1 dòng mô tả ngắn</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">ITS sẽ dùng thông tin trên để cá nhân hoá gợi ý cho người học.</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
};

export default NewCourse;
