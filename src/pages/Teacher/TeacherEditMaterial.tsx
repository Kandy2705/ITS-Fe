import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";
import PageMeta from "../../components/common/PageMeta";
import AdminLoading from "../../components/common/AdminLoading";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import type { ApiResponse } from "../../interfaces/api";
import { FiX } from "react-icons/fi";

type MaterialFormat = "document" | "slide" | "video" | "image" | "reading";
type ContentType = "document" | "slide" | "video" | "image" | "reading";

// Content from API
type ApiContentType =
  | "DOCUMENT"
  | "LECTURE"
  | "VIDEO"
  | "IMAGE"
  | "LINK"
  | "MATERIAL";
type ApiContentStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

interface Content {
  id: string;
  courseInstanceId: string;
  title: string;
  description: string | null;
  type: ApiContentType;
  status: ApiContentStatus;
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
  fileType: string;
  uploadedAt: string;
}

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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const TeacherEditMaterial = () => {
  const navigate = useNavigate();
  const { courseId, materialId } = useParams<{
    courseId: string;
    materialId: string;
  }>();

  const [material, setMaterial] = useState({
    title: "",
    format: "document" as MaterialFormat,
    description: "",
    files: [] as File[],
    link: "",
  });

  const [contentMeta, setContentMeta] = useState({
    type: "document" as ContentType,
  });

  const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(
    []
  );
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API ContentType to frontend MaterialFormat
  const mapApiTypeToFormat = (apiType: ApiContentType): MaterialFormat => {
    const typeMap: Record<ApiContentType, MaterialFormat> = {
      DOCUMENT: "document",
      LECTURE: "slide",
      VIDEO: "video",
      IMAGE: "image",
      LINK: "reading",
      MATERIAL: "document",
    };
    return typeMap[apiType] || "document";
  };

  // Map frontend ContentType to API ContentType
  const mapContentTypeToEnum = (type: ContentType): ApiContentType => {
    const mapping: Record<ContentType, ApiContentType> = {
      document: "DOCUMENT",
      slide: "LECTURE",
      video: "VIDEO",
      image: "IMAGE",
      reading: "LINK",
    };
    return mapping[type] || "DOCUMENT";
  };

  // Fetch content detail and attachments
  const fetchContentDetail = useCallback(async () => {
    if (!materialId) {
      navigate(`/teacher/courses/${courseId || ""}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch content detail
      const contentRes = await api.get<ApiResponse<Content>>(
        `/learning-management/contents/${materialId}`
      );

      if (!contentRes.data.success || !contentRes.data.data) {
        throw new Error(
          contentRes.data.message || "Không thể tải thông tin tài liệu"
        );
      }

      const content = contentRes.data.data;
      const format = mapApiTypeToFormat(content.type);

      setMaterial({
        title: content.title,
        format,
        description: content.description || "",
        files: [],
        link: "",
      });

      setContentMeta({
        type:
          format === "video"
            ? "video"
            : format === "slide"
            ? "slide"
            : format === "image"
            ? "image"
            : format === "reading"
            ? "reading"
            : "document",
      });

      // Fetch attachments
      try {
        const attachmentsRes = await api.get<ApiResponse<Attachment[]>>(
          `/learning-management/contents/${materialId}/attachments`
        );

        if (attachmentsRes.data.success && attachmentsRes.data.data) {
          setExistingAttachments(attachmentsRes.data.data);
        }
      } catch (err) {
        // Silently fail for attachments - not critical
        console.error("Failed to load attachments:", err);
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tải thông tin tài liệu";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [materialId, navigate, courseId]);

  useEffect(() => {
    void fetchContentDetail();
  }, [fetchContentDetail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMaterial((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setMaterial((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveExistingAttachment = (attachmentId: string) => {
    setAttachmentsToDelete((prev) => [...prev, attachmentId]);
    setExistingAttachments((prev) =>
      prev.filter((att) => att.id !== attachmentId)
    );
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
    if (!material.title.trim() || !materialId || !courseId) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Update content
      const contentRequest = {
        title: material.title.trim(),
        description: material.description.trim() || null,
        type: mapContentTypeToEnum(contentMeta.type),
        status: "PUBLISHED" as ApiContentStatus, // Keep existing status or use PUBLISHED
      };

      const contentResponse = await api.patch<ApiResponse<Content>>(
        `/learning-management/contents/${materialId}`,
        contentRequest
      );

      if (!contentResponse.data.success) {
        throw new Error(
          contentResponse.data.message || "Không thể cập nhật nội dung"
        );
      }

      // Delete attachments that were marked for deletion
      for (const attachmentId of attachmentsToDelete) {
        try {
          await api.delete(`/learning-management/attachments/${attachmentId}`);
        } catch (err) {
          console.error(`Failed to delete attachment ${attachmentId}:`, err);
          // Continue with other deletions
        }
      }

      // Upload new files
      for (const file of material.files) {
        if (material.format !== "reading") {
          const formData = new FormData();
          formData.append("file", file);

          try {
            await api.post(
              `/learning-management/contents/${materialId}/attachments`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
          } catch (err) {
            console.error(`Failed to upload file ${file.name}:`, err);
            // Continue with other uploads
          }
        }
      }

      // Success - navigate back to course detail
      navigate(`/teacher/courses/${courseId}`);
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi cập nhật tài liệu";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <AdminLoading message="Đang tải thông tin tài liệu..." />
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title="Chỉnh sửa tài liệu"
        description="Cập nhật thông tin học liệu"
      />

      <PageBreadcrumb pageTitle="Chỉnh sửa học liệu" />

      <div className="mb-6">
        <p className="text-gray-600">
          Cập nhật thông tin học liệu để sinh viên truy cập. Các thiết lập ở đây
          sẽ dùng cho mục <strong>Tài liệu học tập</strong> và{" "}
          <strong>chi tiết tài liệu</strong>.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {!materialId && (
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-800">
            Không tìm thấy materialId. Vui lòng quay lại trang khóa học.
          </p>
        </div>
      )}

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
                Định dạng tệp / Loại nội dung{" "}
                <span className="text-red-500">*</span>
              </label>
              <p className="mb-2 text-xs text-gray-500">
                Loại nội dung sẽ được tự động xác định dựa trên định dạng bạn
                chọn
              </p>
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
                            files: format === "reading" ? [] : prev.files,
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
              <p className="mt-2 text-xs text-gray-500">
                Loại nội dung hiện tại:{" "}
                <span className="font-medium">
                  {contentTypeLabels[contentMeta.type]}
                </span>
              </p>
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

                {/* Existing attachments */}
                {existingAttachments.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Tệp đính kèm hiện có:
                    </p>
                    {existingAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center flex-1 min-w-0">
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
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveExistingAttachment(attachment.id)
                          }
                          className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New files to upload */}
                {material.files.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      Tệp mới sẽ được thêm:
                    </p>
                    {material.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-blue-50 p-3"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex-shrink-0 rounded-md bg-blue-100 p-2">
                            <svg
                              className="h-5 w-5 text-blue-400"
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
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File upload area */}
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
                          multiple
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
                        : ""}{" "}
                      (Có thể chọn nhiều file)
                    </p>
                  </div>
                </div>
              </div>
            )}
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
              disabled={
                isSubmitting ||
                !material.title.trim() ||
                !materialId ||
                !courseId
              }
              className="rounded-lg border border-transparent px-6 py-2.5 text-sm font-medium text-white shadow-sm bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
