import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import api from "../../utils/api";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import type { ApiResponse } from "../../interfaces/api";
import type { PageResponse } from "../../interfaces/pagination";
import {
  FiSearch,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

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

// Material type for display (mapped from Content)
type MaterialType = "document" | "slide" | "video" | "image" | "reading";
type MaterialStatus = "active" | "inactive" | "hidden";

interface LearningMaterial {
  id: string;
  courseInstanceId: string;
  title: string;
  description: string;
  type: MaterialType;
  status: MaterialStatus;
  orderIndex: number;
  dueDate: string | null;
  allowAt: string;
  allowedLate: boolean;
  createdAt: string;
  updatedAt: string;
}

type SortOption = "newest" | "oldest";

const StudentCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Contents state
  const [contents, setContents] = useState<Content[]>([]);
  const [contentsLoading, setContentsLoading] = useState(false);
  const [contentsError, setContentsError] = useState<string | null>(null);

  // Map Content from API to LearningMaterial for display
  const mapContentToMaterial = (content: Content): LearningMaterial => {
    // Map ApiContentType to MaterialType
    const typeMap: Record<ApiContentType, MaterialType> = {
      DOCUMENT: "document",
      LECTURE: "slide",
      VIDEO: "video",
      IMAGE: "image",
      LINK: "reading",
      MATERIAL: "document",
    };

    // Map ApiContentStatus to MaterialStatus
    const statusMap: Record<ApiContentStatus, MaterialStatus> = {
      PUBLISHED: "active",
      DRAFT: "inactive",
      ARCHIVED: "hidden",
    };

    return {
      id: content.id,
      courseInstanceId: content.courseInstanceId,
      title: content.title,
      description: content.description || "",
      type: typeMap[content.type] || "document",
      status: statusMap[content.status] || "inactive",
      orderIndex: content.orderIndex,
      dueDate: null, // API doesn't provide this
      allowAt: content.createdAt,
      allowedLate: true, // Default value
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    };
  };

  // Fetch contents from API
  const fetchContents = useCallback(async () => {
    if (!id) return;

    setContentsLoading(true);
    setContentsError(null);

    try {
      const res = await api.get<ApiResponse<PageResponse<Content>>>(
        "/learning-management/contents",
        {
          params: {
            courseInstanceId: id,
            page: 0,
            size: 100, // Get all contents
            sort: "orderIndex",
          },
        }
      );

      if (res.data.success && res.data.data) {
        const apiContents = res.data.data.content || [];
        setContents(apiContents);
      } else {
        setContentsError(
          res.data.message || "Không thể tải danh sách tài liệu"
        );
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tải danh sách tài liệu";
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
      setContentsError(errorMessage);
    } finally {
      setContentsLoading(false);
    }
  }, [id]);

  // Fetch contents on mount
  useEffect(() => {
    void fetchContents();
  }, [fetchContents]);

  const filteredAndSortedMaterials = useMemo(() => {
    // Map contents to materials
    const materials = contents.map(mapContentToMaterial);
    let result = [...materials];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (material) =>
          material.title.toLowerCase().includes(query) ||
          material.description.toLowerCase().includes(query)
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sortBy === "newest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    return result;
  }, [searchQuery, sortBy, contents]);

  const getStatusLabel = (status: MaterialStatus): string => {
    const statusMap: Record<MaterialStatus, string> = {
      active: "Đang mở",
      inactive: "Đã đóng",
      hidden: "Chưa mở",
    };
    return statusMap[status];
  };

  const getMaterialTypeLabel = (type: MaterialType): string => {
    const typeMap: Record<MaterialType, string> = {
      document: "Tài liệu (PDF/DOCX/TXT)",
      slide: "Slide (PPTX)",
      video: "Video bài giảng",
      image: "Hình ảnh / infographic",
      reading: "Bài đọc / chương",
    };
    return typeMap[type];
  };

  const getMaterialInfo = (material: LearningMaterial) => ({
    typeLabel: getMaterialTypeLabel(material.type),
    statusLabel: getStatusLabel(material.status),
    isLocked: material.status === "hidden",
  });

  return (
    <>
      <PageMeta
        title="Khoá học của tôi"
        description="Xem và quản lý tài liệu học tập"
      />

      <PageBreadcrumb pageTitle="Chi tiết khóa học" />

      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  CS101
                </span>
                <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  3 tín chỉ
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">
                Nhập môn điện toán
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Khóa học này giúp các bạn nắm vững kiến thức cơ bản về điện toán
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Giáo viên: TS. Nguyễn Văn A
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3 md:mt-0">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-xs font-medium text-gray-500">Trạng thái</p>
                <p className="text-sm font-semibold text-green-600">
                  Đang hoạt động
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tài liệu học tập
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="Tìm kiếm tài liệu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      onClick={() => setIsSortOpen(!isSortOpen)}
                    >
                      <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                      {sortBy === "newest" ? "Mới nhất" : "Cũ nhất"}
                      {isSortOpen ? (
                        <FiChevronUp className="ml-2 h-4 w-4" />
                      ) : (
                        <FiChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </button>
                    {isSortOpen && (
                      <div className="absolute right-0 z-10 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSortBy("newest");
                              setIsSortOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm ${
                              sortBy === "newest"
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            Mới nhất
                          </button>
                          <button
                            onClick={() => {
                              setSortBy("oldest");
                              setIsSortOpen(false);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm ${
                              sortBy === "oldest"
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            Cũ nhất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {contentsError && (
                <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    {contentsError}
                  </p>
                </div>
              )}
              <div className="mt-4 space-y-4">
                {contentsLoading ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-brand-600"></div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Đang tải tài liệu...
                    </h3>
                  </div>
                ) : filteredAndSortedMaterials.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Không tìm thấy tài liệu
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery
                        ? "Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc"
                        : "Chưa có tài liệu nào trong khóa học này"}
                    </p>
                  </div>
                ) : (
                  filteredAndSortedMaterials.map((material) => {
                    const { typeLabel, statusLabel, isLocked } =
                      getMaterialInfo(material);

                    return (
                      <div
                        key={material.id}
                        className={`group flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                          material.status === "active"
                            ? "border-brand-300 bg-brand-50 hover:border-brand-400"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          if (!isLocked) {
                            navigate(
                              `/student/courses/${id}/files/${material.id}`
                            );
                          }
                        }}
                        style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
                      >
                        <span
                          className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                            material.status === "active"
                              ? "bg-brand-600"
                              : "bg-gray-300"
                          }`}
                        >
                          {material.orderIndex + 1}
                        </span>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {material.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {typeLabel}
                                {" • "}
                                {statusLabel}
                              </p>
                            </div>
                          </div>
                          {material.dueDate && (
                            <p className="mt-1 text-xs text-gray-500">
                              Hạn xem:{" "}
                              {new Date(material.dueDate).toLocaleString(
                                "vi-VN"
                              )}
                              {material.allowedLate ? " • Cho phép trễ" : ""}
                            </p>
                          )}

                          <div className="mt-2 flex gap-2">
                            <button
                              className={`rounded-lg px-3 py-1 text-sm font-medium ${
                                isLocked
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-brand-600 text-white hover:bg-brand-700"
                              }`}
                              disabled={isLocked}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isLocked) {
                                  navigate(
                                    `/student/courses/${id}/files/${material.id}`
                                  );
                                }
                              }}
                            >
                              {isLocked ? "Chưa mở" : "Xem tài liệu"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCourseDetail;
