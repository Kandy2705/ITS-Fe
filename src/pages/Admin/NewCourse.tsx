import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../utils/api";

interface CourseFormData {
  title: string;
  code: string;
  description: string;
}

const NewCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    code: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Tiêu đề là bắt buộc");
      return;
    }
    if (!formData.description.trim()) {
      setError("Mô tả chi tiết là bắt buộc");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody: {
        title: string;
        code?: string;
        description: string;
        credit?: number;
        status?: string;
      } = {
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      // Only include code if it's not empty
      if (formData.code.trim()) {
        requestBody.code = formData.code.trim();
      }

      // Optional fields (backend will use defaults if not provided)
      requestBody.credit = 3;
      requestBody.status = "ACTIVE";

      const response = await api.post(
        "/learning-management/courses",
        requestBody
      );

      if (response.data.success) {
        // Sau khi tạo thành công, điều hướng về trang danh sách khóa học của admin
        navigate("/admin/courses");
      } else {
        setError(response.data.message || "Không thể tạo khóa học");
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tạo khóa học";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Đã xảy ra lỗi khi tạo khóa học";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Tạo khoá học mới"
        description="Biểu mẫu thêm khoá học với đầy đủ thông tin và tuỳ chọn"
      />
      <PageBreadcrumb pageTitle="Tạo khoá học mới" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-6 shadow-card md:flex-row md:items-center border-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Tạo mới khoá học
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-10 rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white shadow hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu khoá học"}
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-800">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl bg-white p-6 shadow-card border-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Chi tiết</h2>
              <span className="text-xs font-semibold text-brand-600">
                Bắt buộc
              </span>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-gray-800">
                Tiêu đề *
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                  placeholder="Lập trình Web nâng cao"
                  required
                />
              </label>
              {/* <label className="space-y-2 text-sm font-semibold text-gray-800">
                Danh mục
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                  placeholder="Web, AI, Data..."
                />
              </label> */}
              {/* <label className="space-y-2 text-sm font-semibold text-gray-800">
                Giảng viên *
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                  placeholder="Tên người phụ trách"
                />
              </label> */}
              <label className="space-y-2 text-sm font-semibold text-gray-800">
                Code
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                  placeholder="VD: WEB101, CS201..."
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* <div className="space-y-2 text-sm font-semibold text-gray-800">
                Ảnh khoá học
                <div className="flex items-center gap-4">
                  <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                    Upload
                  </button>
                  <p className="text-sm font-normal text-gray-600">
                    Ảnh xuất hiện ở thẻ khoá học
                  </p>
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
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: preset.value }}
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-card border-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Giới thiệu khoá học
            </h2>
            <div className="mt-4 grid gap-4">
              <label className="space-y-2 text-sm font-semibold text-gray-800">
                Mô tả chi tiết *
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[140px] w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                  placeholder="Giới thiệu nội dung, yêu cầu nền tảng, kết quả đạt được..."
                  required
                />
              </label>
              {/* <label className="space-y-2 text-sm font-semibold text-gray-800">
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
              </label> */}
            </div>
          </section>

          {/* <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">
                Giá & chứng chỉ
              </h2>
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
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800"
                    >
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
            </section> */}

          {/* <section className="rounded-2xl bg-white p-6 shadow-card">
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
            </section> */}
        </div>

        <div className="">
          {/* <aside className="space-y-6">
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
                  <label
                    key={item.key}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
                  >
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
                    <p className="text-sm font-semibold text-gray-900">
                      Tên khoá học
                    </p>
                    <p className="text-xs text-gray-600">1 dòng mô tả ngắn</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  ITS sẽ dùng thông tin trên để cá nhân hoá gợi ý cho người học.
                </p>
              </div>
            </section>
          </aside> */}
        </div>
      </div>
    </>
  );
};

export default NewCourse;
