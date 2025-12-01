import { useMemo, useState } from "react";
import { useParams, Link } from "react-router";
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
  {
    id: "c2",
    courseInstanceId: "ci-1",
    title: "Tài liệu: Phân tích yêu cầu ITS",
    description: `<p>Tài liệu cung cấp khái niệm về <strong>stakeholder</strong>, <em>functional requirements</em>, <em>non-functional requirements</em> và phương pháp thu thập yêu cầu trong các hệ thống ITS.</p>`,
    type: "reading",
    status: "active",
    orderIndex: 2,
    dueDate: "2025-12-10T23:59:59Z",
    allowAt: "2025-12-01T00:00:00Z",
    allowedLate: true,
    createdAt: "2025-11-26T09:00:00Z",
    updatedAt: "2025-11-26T09:00:00Z",
  },
  {
    id: "c3",
    courseInstanceId: "ci-1",
    title: "Video: Dự báo lộ trình tự động",
    description: `<p>Video giải thích nguyên lý hoạt động của mô-đun <strong>dự báo lộ trình học tập</strong>, cách mô hình phân tích hành vi người học và đề xuất tài liệu phù hợp.</p>`,
    type: "video",
    status: "hidden",
    orderIndex: 3,
    dueDate: null,
    allowAt: "2025-12-15T00:00:00Z",
    allowedLate: false,
    createdAt: "2025-11-27T14:00:00Z",
    updatedAt: "2025-11-27T14:00:00Z",
  },
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

const StudentFileDetail = () => {
  const { courseId, fileId } = useParams();
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const currentContent: Content =
    contents.find((c) => c.id === fileId) ?? contents[0];

  const courseName = useMemo(() => {
    if (!courseId) return "Khóa học của tôi";
    return courseId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [courseId]);

  const statusLabel = getStatusLabel(currentContent.status);
  const typeLabel = getTypeLabel(currentContent.type);

  return (
    <>
      <PageMeta
        title={`${currentContent.title} - Tài liệu học tập`}
        description="Xem và tương tác với tài liệu học tập"
      />

      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Link to="/student/courses" className="hover:text-brand-600">
          Khóa học của tôi
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/student/courses/${courseId}`}
          className="hover:text-brand-600"
        >
          {courseName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{currentContent.title}</span>
      </div>

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
                  Tạo vào lúc
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(currentContent.updatedAt)}
                </p>
                <p className="text-xs text-gray-500">Do giảng viên tạo</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Xem trước tài liệu
                </h3>
                <div className="flex gap-2"></div>
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
            <div className="mt-4 border-t border-gray-200 pt-4">
              <button className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                <div className="flex items-center justify-center gap-2">
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
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">
              Hành động nhanh
            </h3>
            <div className="mt-3 space-y-2 text-sm">
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
                className="group relative flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50"
              >
                <svg
                  className="h-5 w-5 text-gray-500 group-hover:text-brand-500"
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
                Chia sẻ với bạn bè
                {/* Success notification */}
                {showCopySuccess && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform rounded-xl border border-success-500 bg-success-50 px-4 py-2 text-sm font-medium text-success-800 shadow-lg dark:border-success-500/30 dark:bg-success-500/15">
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
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Xem trước
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                In tài liệu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentFileDetail;
