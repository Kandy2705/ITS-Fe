import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";

type ContentType = "document" | "slide" | "video" | "image" | "reading";
type ContentStatus = "active" | "inactive" | "hidden";

interface Content {
  id: string;
  courseInstanceId: string;
  title: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  orderIndex: number;
  dueDate: string | null;
  allowAt: string;
  allowedLate: boolean;
  createdAt: string;
  updatedAt: string;
}

const contents: Content[] = [
  {
    id: "c1",
    courseInstanceId: "ci-1",
    title: "Giới thiệu khoá học",
    description: `<p><strong>Giới thiệu tổng quan về môn học</strong>, mục tiêu kiến thức, phạm vi nội dung và hướng dẫn cách sử dụng hệ thống ITS trong suốt quá trình học tập.</p>`,
    type: "document",
    status: "active",
    orderIndex: 1,
    dueDate: null,
    allowAt: "2025-12-01T00:00:00Z",
    allowedLate: false,
    createdAt: "2025-11-25T10:00:00Z",
    updatedAt: "2025-11-25T10:00:00Z",
  },
  // ... other content items
];

const fileMeta = {
  fileName: "bai-giang-chuong-1.pdf",
  fileType: "PDF",
  fileSize: "2.4 MB",
};

const formatDate = (iso: string | null) => {
  if (!iso) return "Không giới hạn";
  return new Date(iso).toLocaleString("vi-VN");
};

const getStatusLabel = (status: ContentStatus) => {
  const map: Record<ContentStatus, string> = {
    active: "Đang mở",
    inactive: "Đã đóng",
    hidden: "Chưa mở",
  };
  return map[status];
};

const getTypeLabel = (type: ContentType) => {
  const map: Record<ContentType, string> = {
    document: "Tài liệu (PDF/DOCX/TXT)",
    slide: "Slide (PPTX)",
    video: "Video bài giảng",
    image: "Hình ảnh / infographic",
    reading: "Bài đọc / chương",
  };
  return map[type];
};

const FileDetail = () => {
  const { courseId, materialId } = useParams();
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const navigate = useNavigate();

  const currentContent: Content =
    contents.find((c) => c.id === materialId) ?? contents[0];

  const statusLabel = getStatusLabel(currentContent.status);
  const typeLabel = getTypeLabel(currentContent.type);

  const handleEdit = () => {
    navigate(`/teacher/courses/${courseId}/materials/${materialId}/edit`);
  };

  return (
    <>
      <PageMeta
        title={`${currentContent.title} - Tài liệu học tập`}
        description="Xem và quản lý tài liệu học tập"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-blue-100 px-2 py-1 font-medium text-blue-800">
                    {typeLabel}
                  </span>
                  <span
                    className={`rounded-md px-2 py-1 font-medium ${
                      currentContent.status === "active"
                        ? "bg-green-100 text-green-800"
                        : currentContent.status === "hidden"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentContent.title}
                </h2>
                <div
                  className="mt-1 text-sm text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: currentContent.description,
                  }}
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">{/* Content here */}</div>
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Hạn xem
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(currentContent.dueDate)}
                </p>
                <p className="text-xs text-gray-500">
                  {currentContent.dueDate
                    ? currentContent.allowedLate
                      ? "Cho phép truy cập sau hạn"
                      : "Tự động ẩn sau hạn"
                    : "Không giới hạn thời gian"}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Cập nhật lần cuối
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(currentContent.updatedAt)}
                </p>
                <p className="text-xs text-gray-500">
                  Bởi {currentContent.updatedAt || "Hệ thống"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Xem trước tài liệu
                </h3>
              </div>
              <div className="mt-3 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Xem trước tài liệu {fileMeta.fileType}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Trình đọc PDF/Slide sẽ được hiển thị tại đây
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">
              Thông tin tệp
            </h3>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium text-gray-900">Tên tệp</p>
                <p className="text-gray-600">{fileMeta.fileName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Loại nội dung</p>
                <p className="text-gray-600">{typeLabel}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Loại tệp</p>
                <p className="text-gray-600">{fileMeta.fileType}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Kích thước</p>
                <p className="text-gray-600">{fileMeta.fileSize}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ngày tạo</p>
                <p className="text-gray-600">
                  {formatDate(currentContent.createdAt)}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Tải xuống tài liệu
              </button>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setShowCopySuccess(true);
                    setTimeout(() => setShowCopySuccess(false), 2000);
                  } catch (err) {
                    console.error("Failed to copy URL: ", err);
                  }
                }}
                className="group relative flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50"
              >
                <svg
                  className="h-4 w-4 text-gray-500 group-hover:text-brand-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Chia sẻ với sinh viên
                {showCopySuccess && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform rounded-xl border border-success-500 bg-success-50 px-4 py-2 text-sm font-medium text-success-800 shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Đã sao chép liên kết!
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">
              Thống kê truy cập
            </h3>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600">Lượt xem</span>
                <span className="font-medium text-gray-900">1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lượt tải về</span>
                <span className="font-medium text-gray-900">892</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileDetail;
