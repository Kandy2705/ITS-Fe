import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

type MaterialFormat = "document" | "slide" | "video" | "image" | "reading";
type ContentType = "document" | "slide" | "video" | "image" | "reading";
type ContentStatus = "active" | "inactive" | "hidden";

const materialLabels: Record<MaterialFormat, string> = {
  document: "Tài liệu",
  slide: "Slide",
  video: "Video",
  image: "Hình ảnh",
  reading: "Bài đọc",
};

const contentTypeLabels: Record<ContentType, string> = {
  document: "Tài liệu (PDF/DOCX/TXT)",
  slide: "Slide bài giảng",
  video: "Video bài giảng",
  image: "Hình ảnh / infographic",
  reading: "Bài đọc / chương",
};

const contentStatusLabels: Record<ContentStatus, string> = {
  active: "Đang mở cho sinh viên",
  inactive: "Đã đóng",
  hidden: "Chưa mở (ẩn với sinh viên)",
};

const TeacherEditMaterial = () => {
  const navigate = useNavigate();
  const { courseId, materialId } = useParams();

  const [material, setMaterial] = useState({
    title: "",
    format: "document" as MaterialFormat,
    description: "",
    file: null as File | null,
    link: "",
  });

  const [contentMeta, setContentMeta] = useState({
    type: "document" as ContentType,
    status: "active" as ContentStatus,
    allowAt: "",
    dueDate: "",
    allowedLate: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!materialId) {
      navigate(`/teacher/courses/${courseId || ""}`);
      return;
    }

    // Simulate API call to fetch material data
    const fetchMaterial = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/materials/${materialId}`);
        // const data = await response.json();

        // Mock data for demo
        const mockData = {
          title: "Tài liệu mẫu",
          format: "document" as MaterialFormat,
          description: "Mô tả mẫu cho tài liệu",
          type: "document" as ContentType,
          status: "active" as ContentStatus,
          allowAt: "",
          dueDate: "",
          allowedLate: false,
        };

        setMaterial((prev) => ({
          ...prev,
          title: mockData.title,
          format: mockData.format,
          description: mockData.description,
        }));

        setContentMeta({
          type: mockData.type,
          status: mockData.status,
          allowAt: mockData.allowAt,
          dueDate: mockData.dueDate,
          allowedLate: mockData.allowedLate,
        });
      } catch (error) {
        console.error("Error fetching material:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId, navigate, courseId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMaterial((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const mapFormatToContentType = (format: MaterialFormat): ContentType => {
    if (format === "video") return "video";
    if (format === "slide") return "slide";
    if (format === "image") return "image";
    if (format === "reading") return "reading";
    return "document";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.title.trim() || !courseId) return;

    setIsSubmitting(true);

    const payload = {
      id: materialId,
      title: material.title.trim(),
      shortDescription: material.description.trim(),
      format: material.format,
      fileName: material.file?.name ?? null,
      fileSize: material.file ? material.file.size : null,
      link: material.format === "reading" ? material.description.trim() : null,
      type: contentMeta.type,
      status: contentMeta.status,
      allowAt: contentMeta.allowAt || null,
      dueDate: contentMeta.dueDate || null,
      allowedLate: contentMeta.allowedLate,
      courseInstanceId: courseId,
    };

    try {
      // Replace with actual API call
      // await fetch(`/api/materials/${materialId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });

      console.log("Material updated:", payload);
      navigate(`/teacher/courses/${courseId}`);
    } catch (error) {
      console.error("Error updating material:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Chỉnh sửa tài liệu"
        description="Cập nhật thông tin học liệu"
      />

      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-sm font-medium text-gray-600 hover:text-brand-600"
        >
          <svg
            className="mr-1 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa học liệu</h1>
        <p className="text-gray-600">
          Cập nhật thông tin học liệu để sinh viên truy cập
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Thông tin cơ bản */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Thông tin cơ bản
            </h2>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Tiêu đề học liệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={material.title}
                onChange={(e) =>
                  setMaterial((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ví dụ: Bài giảng tuần 1 - Giới thiệu ITS"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Mô tả ngắn
              </label>
              <textarea
                rows={3}
                value={material.description}
                onChange={(e) =>
                  setMaterial((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Mô tả ngắn gọn về học liệu này..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* 2. Định dạng & tệp */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Định dạng & tệp đính kèm
            </h2>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Định dạng tệp <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {(Object.keys(materialLabels) as MaterialFormat[]).map(
                  (format) => (
                    <label
                      key={format}
                      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition ${
                        material.format === format
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={material.format === format}
                        onChange={() => {
                          const newType = mapFormatToContentType(format);
                          setMaterial((prev) => ({
                            ...prev,
                            format,
                            file: format === "reading" ? null : prev.file,
                            link: format === "reading" ? prev.link : "",
                          }));
                          setContentMeta((prev) => ({
                            ...prev,
                            type: newType,
                          }));
                        }}
                        className="sr-only"
                      />
                      <span>{materialLabels[format]}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {material.format === "reading" ? (
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={material.description}
                  onChange={(e) =>
                    setMaterial((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Nhập nội dung bài đọc"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 min-h-[100px]"
                  required={material.format === "reading"}
                  rows={5}
                />
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Tệp đính kèm
                </label>
                <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2"
                      >
                        <span>Tải lên file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept={
                            material.format === "document"
                              ? ".pdf,.doc,.docx,.txt"
                              : material.format === "video"
                              ? "video/*"
                              : material.format === "slide"
                              ? ".ppt,.pptx,.odp"
                              : material.format === "image"
                              ? "image/*"
                              : ""
                          }
                        />
                      </label>
                      <p className="pl-1">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {material.format === "document"
                        ? "PDF/DOCX/TXT tối đa 10MB"
                        : material.format === "video"
                        ? "MP4, MOV tối đa 100MB"
                        : material.format === "slide"
                        ? "PPT, PPTX, ODP tối đa 20MB"
                        : material.format === "image"
                        ? "Ảnh (PNG, JPG, JPEG) tối đa 10MB"
                        : ""}
                    </p>
                  </div>
                </div>
                {material.file && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 rounded-md bg-gray-100 p-2">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {material.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(material.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setMaterial((prev) => ({ ...prev, file: null }))
                      }
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Xoá</span>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Thiết lập metadata nội dung */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Thiết lập metadata nội dung
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Loại nội dung
                </label>
                <select
                  value={contentMeta.type}
                  onChange={(e) =>
                    setContentMeta((prev) => ({
                      ...prev,
                      type: e.target.value as ContentType,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  {(Object.keys(contentTypeLabels) as ContentType[]).map(
                    (t) => (
                      <option key={t} value={t}>
                        {contentTypeLabels[t]}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Trạng thái hiển thị
                </label>
                <select
                  value={contentMeta.status}
                  onChange={(e) =>
                    setContentMeta((prev) => ({
                      ...prev,
                      status: e.target.value as ContentStatus,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  {(Object.keys(contentStatusLabels) as ContentStatus[]).map(
                    (s) => (
                      <option key={s} value={s}>
                        {contentStatusLabels[s]}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Thời điểm cho phép truy cập (allowAt)
                </label>
                <input
                  type="datetime-local"
                  value={contentMeta.allowAt}
                  onChange={(e) =>
                    setContentMeta((prev) => ({
                      ...prev,
                      allowAt: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Để trống nếu muốn mở ngay khi cập nhật.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Hạn xem (dueDate)
                </label>
                <input
                  type="datetime-local"
                  value={contentMeta.dueDate}
                  onChange={(e) =>
                    setContentMeta((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Dùng cho LCM: sau hạn có thể tự ẩn hoặc cho phép xem trễ.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setContentMeta((prev) => ({
                    ...prev,
                    allowedLate: !prev.allowedLate,
                  }))
                }
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  contentMeta.allowedLate ? "bg-brand-600" : "bg-gray-200"
                }`}
                aria-pressed={contentMeta.allowedLate}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    contentMeta.allowedLate ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700">
                Cho phép sinh viên truy cập sau hạn (allowedLate)
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !material.title.trim()}
              className="rounded-lg border border-transparent bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditMaterial;
