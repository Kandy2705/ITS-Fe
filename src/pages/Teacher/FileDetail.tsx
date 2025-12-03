import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import api from "../../utils/api";
import PageMeta from "../../components/common/PageMeta";
import AdminLoading from "../../components/common/AdminLoading";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import type { ApiResponse } from "../../interfaces/api";

// Content from API
type ContentType =
  | "DOCUMENT"
  | "LECTURE"
  | "VIDEO"
  | "LESSON"
  | "IMAGE"
  | "LINK"
  | "MATERIAL";
type ContentStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
type FileType =
  | "PDF"
  | "DOCUMENT"
  | "SPREADSHEET"
  | "PRESENTATION"
  | "IMAGE"
  | "VIDEO"
  | "AUDIO"
  | "ZIP"
  | "OTHER";

interface Content {
  id: string;
  courseInstanceId: string;
  title: string;
  description: string | null;
  type: ContentType;
  status: ContentStatus;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface Attachment {
  id: string;
  ownerId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: FileType;
  uploadedAt: string;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "Không giới hạn";
  return new Date(iso).toLocaleString("vi-VN");
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getStatusLabel = (status: ContentStatus) => {
  const map: Record<ContentStatus, string> = {
    PUBLISHED: "Đang mở",
    DRAFT: "Bản nháp",
    ARCHIVED: "Đã đóng",
  };
  return map[status] || status;
};

const getTypeLabel = (type: ContentType) => {
  const map: Record<ContentType, string> = {
    DOCUMENT: "Tài liệu",
    LECTURE: "Slide",
    VIDEO: "Video",
    LESSON: "Bài học",
    IMAGE: "Hình ảnh",
    LINK: "Bài đọc",
    MATERIAL: "Tài liệu",
  };
  return map[type] || type;
};

const getFileTypeLabel = (fileType: FileType): string => {
  const map: Record<FileType, string> = {
    PDF: "PDF",
    DOCUMENT: "Word/Document",
    SPREADSHEET: "Excel/Spreadsheet",
    PRESENTATION: "PowerPoint/Presentation",
    IMAGE: "Hình ảnh",
    VIDEO: "Video",
    AUDIO: "Âm thanh",
    ZIP: "Nén",
    OTHER: "Khác",
  };
  return map[fileType] || fileType;
};

const FileDetail = () => {
  const { courseId, materialId } = useParams<{
    courseId: string;
    materialId: string;
  }>();
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const navigate = useNavigate();

  const [content, setContent] = useState<Content | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);

  // Fetch content detail
  const fetchContentDetail = useCallback(async () => {
    if (!materialId) {
      setError("Không tìm thấy ID tài liệu");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get<ApiResponse<Content>>(
        `/learning-management/contents/${materialId}`
      );

      if (res.data.success && res.data.data) {
        setContent(res.data.data);
      } else {
        setError(res.data.message || "Không thể tải thông tin tài liệu");
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tải thông tin tài liệu";
      if (axios.isAxiosError(err)) {
        if (err.response?.data && typeof err.response.data === "object") {
          const data = err.response.data as { message?: string };
          errorMessage = data.message || err.message || errorMessage;
        } else {
          errorMessage = err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  // Fetch attachments
  const fetchAttachments = useCallback(async () => {
    if (!materialId) return;

    setAttachmentsLoading(true);

    try {
      const res = await api.get<ApiResponse<Attachment[]>>(
        `/learning-management/contents/${materialId}/attachments`
      );

      if (res.data.success && res.data.data) {
        setAttachments(res.data.data);
      }
      // Silently fail for attachments - not critical
    } catch (err: unknown) {
      // Silently fail for attachments - not critical
      console.error("Failed to load attachments:", err);
    } finally {
      setAttachmentsLoading(false);
    }
  }, [materialId]);

  useEffect(() => {
    void fetchContentDetail();
  }, [fetchContentDetail]);

  useEffect(() => {
    if (content) {
      void fetchAttachments();
    }
  }, [content, fetchAttachments]);

  const handleEdit = () => {
    navigate(`/teacher/courses/${courseId}/materials/${materialId}/edit`);
  };

  const handleDownload = (attachment: Attachment) => {
    window.open(attachment.fileUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <AdminLoading message="Đang tải thông tin tài liệu..." />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-red-600">Có lỗi xảy ra</h2>
        <p className="mt-2 text-sm text-gray-700">
          {error || "Không tìm thấy tài liệu"}
        </p>
      </div>
    );
  }

  const statusLabel = getStatusLabel(content.status);
  const typeLabel = getTypeLabel(content.type);

  return (
    <>
      <PageMeta
        title={`${content.title} - Tài liệu học tập`}
        description="Xem và quản lý tài liệu học tập"
      />

      <PageBreadcrumb pageTitle={content.title} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-blue-100 px-2 py-1 font-medium text-blue-800">
                    {typeLabel}
                  </span>
                  <span
                    className={`rounded-md px-2 py-1 font-medium ${
                      content.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : content.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {content.title}
                </h2>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={handleEdit}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>

            {/* Description Section */}
            {content.description && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Mô tả
                </h3>
                <div
                  className="text-base text-gray-700 prose prose-base max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: content.description,
                  }}
                />
              </div>
            )}

            {/* Tệp đính kèm Section */}
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Tệp đính kèm
              </h3>
              {attachmentsLoading ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-600">
                    Đang tải tệp đính kèm...
                  </p>
                </div>
              ) : attachments.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-600">
                    Chưa có tệp đính kèm nào
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <button
                      key={attachment.id}
                      onClick={() => handleDownload(attachment)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-gray-500"
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
                        <span className="truncate text-left">
                          {attachment.fileName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {getFileTypeLabel(attachment.fileType)} •{" "}
                        {formatFileSize(attachment.fileSize)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Ngày tạo
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(content.createdAt)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Cập nhật lần cuối
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(content.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">
              Thông tin tài liệu
            </h3>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium text-gray-900">Loại nội dung</p>
                <p className="text-gray-600">{typeLabel}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Trạng thái</p>
                <p className="text-gray-600">{statusLabel}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ngày tạo</p>
                <p className="text-gray-600">{formatDate(content.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Cập nhật lần cuối</p>
                <p className="text-gray-600">{formatDate(content.updatedAt)}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
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
        </div>
      </div>
    </>
  );
};

export default FileDetail;
