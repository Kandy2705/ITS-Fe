import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import api from "../../utils/api";
import AdminLoading from "../../components/common/AdminLoading";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import type { ApiResponse } from "../../interfaces/api";
import type { PageResponse } from "../../interfaces/pagination";
import type { User as UserType } from "../../interfaces/user";
import {
  FiUsers,
  FiFileText,
  FiPlus,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiClock,
  FiDownload,
} from "react-icons/fi";

// User role and status types
type UserRole = "student" | "teacher" | "admin";
type UserStatus = "active" | "inactive" | "banned";

// User interface for display
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  listCourseInstance?: string[]; // Array of CourseInstance IDs
}

// Course instance interfaces
type CourseInstanceStatus = "ACTIVE" | "INACTIVE";

interface Course {
  id: string;
  title: string;
  code: string | null;
  description?: string | null;
  credit?: string | null;
}

interface CourseInstance {
  id: string;
  course: Course;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  };
  status: CourseInstanceStatus;
}

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
  studentsCompleted?: number;
  totalStudents?: number;
  viewCount?: number;
  lastUpdated?: string;
}

const TeacherCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchQuery] = useState("");
  const [sortBy] = useState<"newest" | "oldest">("newest");
  const [activeTab, setActiveTab] = useState<"materials" | "students">(
    "materials"
  );
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);

  // Contents state
  const [contents, setContents] = useState<Content[]>([]);
  const [contentsLoading, setContentsLoading] = useState(false);
  const [contentsError, setContentsError] = useState<string | null>(null);

  // Attachments state - map contentId to attachments
  const [attachmentsMap, setAttachmentsMap] = useState<
    Record<string, Attachment[]>
  >({});
  const [attachmentsLoading, setAttachmentsLoading] = useState<
    Record<string, boolean>
  >({});

  // Course instance state
  const [courseInstance, setCourseInstance] = useState<CourseInstance | null>(
    null
  );
  const [courseInstanceLoading, setCourseInstanceLoading] = useState(false);
  const [courseInstanceError, setCourseInstanceError] = useState<string | null>(
    null
  );

  // Students state
  const [students, setStudents] = useState<User[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [studentsPage, setStudentsPage] = useState(0);
  const [studentsTotalPages, setStudentsTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const pageSize = 10;

  // Map Content from API to LearningMaterial for display
  const mapContentToMaterial = (content: Content): LearningMaterial => {
    // Map ContentType to MaterialType
    const typeMap: Record<ContentType, MaterialType> = {
      DOCUMENT: "document",
      LECTURE: "slide",
      VIDEO: "video",
      LESSON: "slide",
      IMAGE: "image",
      LINK: "reading",
      MATERIAL: "document",
    };

    // Map ContentStatus to MaterialStatus
    const statusMap: Record<ContentStatus, MaterialStatus> = {
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

  // Filter + sort
  const filteredAndSortedMaterials = useMemo(() => {
    // Map contents to materials
    const materials = contents.map(mapContentToMaterial);
    let result = [...materials];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (material) =>
          material.title.toLowerCase().includes(query) ||
          material.description.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });

    return result;
  }, [searchQuery, sortBy, contents]);

  const getStatusLabel = (status: MaterialStatus): string => {
    const statusMap: Record<MaterialStatus, string> = {
      active: "Đang mở",
      inactive: "Đã đóng",
      hidden: "Đang ẩn",
    };
    return statusMap[status];
  };

  const getMaterialTypeLabel = (type: MaterialType): string => {
    const typeMap: Record<MaterialType, string> = {
      document: "Tài liệu",
      slide: "Slide bài giảng",
      video: "Video",
      image: "Hình ảnh",
      reading: "Bài đọc",
    };
    return typeMap[type] || "Tài liệu học tập";
  };

  const handleDeleteMaterial = async (contentId: string) => {
    if (!id) return;

    try {
      // Lấy danh sách attachments của content này
      const attachments = attachmentsMap[contentId] || [];

      // Xóa tất cả attachments trước
      for (const attachment of attachments) {
        try {
          await api.delete<ApiResponse<void>>(
            `/learning-management/attachments/${attachment.id}`
          );
        } catch (err) {
          // Log lỗi nhưng vẫn tiếp tục xóa các attachment khác
          console.error(`Failed to delete attachment ${attachment.id}:`, err);
        }
      }

      // Xóa content
      const res = await api.delete<ApiResponse<void>>(
        `/learning-management/contents/${contentId}`
      );

      if (res.data.success) {
        // Xóa khỏi state
        setContents((prev) => prev.filter((c) => c.id !== contentId));
        // Xóa attachments khỏi map
        setAttachmentsMap((prev) => {
          const newMap = { ...prev };
          delete newMap[contentId];
          return newMap;
        });
        // Đóng modal
        setMaterialToDelete(null);
      } else {
        throw new Error(res.data.message || "Không thể xóa tài liệu");
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi xóa tài liệu";
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
      alert(errorMessage);
    }
  };

  // Fetch course instance details from API
  const fetchCourseInstance = useCallback(async () => {
    if (!id) return;

    setCourseInstanceLoading(true);
    setCourseInstanceError(null);

    try {
      const res = await api.get<ApiResponse<CourseInstance>>(
        "/learning-management/courses-instance/getDetails",
        {
          params: {
            courseInstanceId: id,
          },
        }
      );

      if (res.data.success && res.data.data) {
        setCourseInstance(res.data.data);
      } else {
        setCourseInstanceError(
          res.data.message || "Không thể tải thông tin khóa học"
        );
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tải thông tin khóa học";
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
      setCourseInstanceError(errorMessage);
    } finally {
      setCourseInstanceLoading(false);
    }
  }, [id]);

  // Fetch total students count (for header display)
  const fetchTotalStudents = useCallback(async () => {
    if (!id) return;

    try {
      const res = await api.get<ApiResponse<PageResponse<UserType>>>(
        "/learning-management/courses-instance/getAllStudentDetails",
        {
          params: {
            courseInstanceId: id,
            page: 0,
            size: 1, // Chỉ cần 1 item để lấy totalElements
          },
        }
      );

      if (res.data.success && res.data.data) {
        setTotalStudents(res.data.data.totalElements || 0);
      }
    } catch (err: unknown) {
      // Không hiển thị lỗi nếu chỉ fetch tổng số, chỉ log
      console.error("Error fetching total students:", err);
    }
  }, [id]);

  // Fetch attachments for a content
  const fetchAttachments = useCallback(async (contentId: string) => {
    setAttachmentsLoading((prev) => ({ ...prev, [contentId]: true }));

    try {
      const res = await api.get<ApiResponse<Attachment[]>>(
        `/learning-management/contents/${contentId}/attachments`
      );

      if (res.data.success && res.data.data) {
        setAttachmentsMap((prev) => ({
          ...prev,
          [contentId]: res.data.data || [],
        }));
      }
    } catch (err: unknown) {
      // Silently fail for attachments - not critical
      console.error(
        `Failed to load attachments for content ${contentId}:`,
        err
      );
      setAttachmentsMap((prev) => ({
        ...prev,
        [contentId]: [],
      }));
    } finally {
      setAttachmentsLoading((prev) => ({ ...prev, [contentId]: false }));
    }
  }, []);

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

        // Fetch attachments for each content
        apiContents.forEach((content) => {
          void fetchAttachments(content.id);
        });
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
  }, [id, fetchAttachments]);

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    if (!id) return;

    setStudentsLoading(true);
    setStudentsError(null);

    try {
      const res = await api.get<ApiResponse<PageResponse<UserType>>>(
        "/learning-management/courses-instance/getAllStudentDetails",
        {
          params: {
            courseInstanceId: id,
            page: studentsPage,
            size: pageSize,
          },
        }
      );

      if (res.data.success && res.data.data) {
        const apiStudents = res.data.data.content || [];

        // Map API response to display format
        // Backend uses uppercase: STUDENT, TEACHER, ADMIN, ACTIVE, INACTIVE
        // Frontend uses lowercase for display
        const mappedStudents: User[] = apiStudents.map((student) => ({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          role:
            student.role === "STUDENT"
              ? "student"
              : student.role === "TEACHER"
              ? "teacher"
              : "admin",
          status:
            student.status === "ACTIVE"
              ? "active"
              : student.status === "INACTIVE"
              ? "inactive"
              : "banned",
        }));

        setStudents(mappedStudents);
        setStudentsTotalPages(res.data.data.totalPages || 0);
        setTotalStudents(res.data.data.totalElements || 0);
      } else {
        setStudentsError(
          res.data.message || "Không thể tải danh sách học viên"
        );
      }
    } catch (err: unknown) {
      let errorMessage = "Đã xảy ra lỗi khi tải danh sách học viên";
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
      setStudentsError(errorMessage);
    } finally {
      setStudentsLoading(false);
    }
  }, [id, studentsPage, pageSize]);

  // Fetch course instance details when component mounts
  useEffect(() => {
    if (id) {
      void fetchCourseInstance();
    }
  }, [id, fetchCourseInstance]);

  // Fetch total students count when component mounts (for header display)
  useEffect(() => {
    if (id) {
      void fetchTotalStudents();
    }
  }, [id, fetchTotalStudents]);

  // Fetch contents when component mounts or when id changes
  useEffect(() => {
    if (id) {
      void fetchContents();
    }
  }, [id, fetchContents]);

  // Fetch students when tab changes to students or when page changes
  useEffect(() => {
    if (activeTab === "students" && id) {
      void fetchStudents();
    }
  }, [activeTab, id, fetchStudents]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const renderMaterialItem = (material: LearningMaterial) => {
    const attachments = attachmentsMap[material.id] || [];
    const isLoadingAttachments = attachmentsLoading[material.id];

    return (
      <div
        key={material.id}
        className="border  bg-white rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{material.title}</h3>
            <p className="text-base text-gray-600 mt-1">
              {material.description}
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {getMaterialTypeLabel(material.type)}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {getStatusLabel(material.status)}
              </span>
              {material.dueDate && (
                <span className="flex items-center">
                  <FiClock className="mr-1" size={14} />
                  Hạn xem:{" "}
                  {new Date(material.dueDate).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>

            {/* Tệp đính kèm */}
            {isLoadingAttachments ? (
              <div className="mt-3 text-sm text-gray-500">
                Đang tải tệp đính kèm...
              </div>
            ) : attachments.length > 0 ? (
              <div className="mt-3 space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Tệp đính kèm:
                </div>
                <div className="space-y-1">
                  {attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <FiDownload size={14} />
                      <span>{attachment.fileName}</span>
                      <span className="text-gray-500 text-xs">
                        ({formatFileSize(attachment.fileSize)})
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center ml-4">
            <div className="text-right">
              <div className="text-sm font-medium">
                {material.studentsCompleted || 0}/{material.totalStudents} đã
                xem
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Cập nhật lần cuối:{" "}
            {new Date(material.updatedAt).toLocaleDateString("vi-VN")}
          </div>
          <div className="space-x-2">
            <button
              onClick={() =>
                navigate(`/teacher/courses/${id}/materials/${material.id}/edit`)
              }
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiEdit2 className="inline mr-1" size={14} />
              Chỉnh sửa
            </button>
            <button
              onClick={() =>
                navigate(`/teacher/courses/${id}/materials/${material.id}`)
              }
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <FiEye className="inline mr-1" size={14} />
              Xem
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMaterialToDelete(material.id);
              }}
              className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50"
            >
              <FiTrash2 className="inline mr-1" size={14} />
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  const courseTitle = courseInstance?.course?.title || "Đang tải...";
  const courseCode = courseInstance?.course?.code;
  const courseId = id || "";
  const totalMaterials = contents.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBreadcrumb pageTitle={courseTitle} />
      <div className="bg-white shadow">
        {courseInstanceError && (
          <div className="mx-4 mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{courseInstanceError}</p>
          </div>
        )}
        <div className="rounded-2xl bg-white p-6 shadow-card">
          {courseInstanceLoading ? (
            <AdminLoading message="Đang tải thông tin khóa học..." />
          ) : (
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {courseCode && (
                    <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {courseCode}
                    </span>
                  )}
                  {courseInstance?.course?.credit && (
                    <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {courseInstance.course.credit} tín chỉ
                    </span>
                  )}
                </div>

                <h1 className="mt-2 text-2xl font-semibold text-gray-900">
                  {courseTitle}
                </h1>
                {courseId && (
                  <p className="mt-1 text-sm text-gray-500">
                    ID khóa học: {courseId}
                  </p>
                )}
                {courseInstance?.course?.description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {courseInstance.course.description}
                  </p>
                )}
                {!courseInstance?.course?.description &&
                  !courseInstanceLoading && (
                    <p className="mt-1 text-sm text-gray-600">Không có mô tả</p>
                  )}
                <div className="mt-2 flex flex-wrap gap-4">
                  <span className="inline-flex items-center text-sm text-gray-600">
                    <FiUsers className="mr-1.5 h-4 w-4 text-gray-500" />
                    {totalStudents} học viên
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-600">
                    <FiFileText className="mr-1.5 h-4 w-4 text-gray-500" />
                    {totalMaterials} tài liệu
                  </span>
                </div>
              </div>
              <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate(`/teacher/courses/${id}/upload`)}
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Thêm tài liệu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav
            className="-mb-px flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            aria-label="Tabs"
          >
            <button
              onClick={() => setActiveTab("materials")}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                activeTab === "materials"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tài liệu học tập
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                activeTab === "students"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Học viên
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="py-6">
        {/* Search + sort
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <FiFilter className="mr-2 h-4 w-4 text-gray-500" />
              Sắp xếp
              {isSortOpen ? (
                <FiChevronUp className="ml-2 h-4 w-4 text-gray-500" />
              ) : (
                <FiChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              )}
            </button>

            {isSortOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
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
                    className={`block w-full text-left px-4 py-2 text-sm ${
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
        </div> */}
        {/* Tab content */}
        <div className="mt-6">
          {activeTab === "materials" && (
            <div className="space-y-4">
              {contentsLoading ? (
                <div className="py-12">
                  <AdminLoading message="Đang tải danh sách tài liệu..." />
                </div>
              ) : contentsError ? (
                <div className="rounded-lg border border-red-300 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    {contentsError}
                  </p>
                </div>
              ) : filteredAndSortedMaterials.length > 0 ? (
                <div>
                  <ul className="divide-y divide-gray-200">
                    {filteredAndSortedMaterials.map((material) => (
                      <li key={material.id}>{renderMaterialItem(material)}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12 bg-white shadow rounded-lg">
                  <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Không có tài liệu nào
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Chưa có tài liệu nào được thêm vào khoá học này.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => navigate(`/teacher/courses/${id}/upload`)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      Thêm tài liệu mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "students" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Danh sách học viên
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Xem và quản lý thông tin học viên trong khoá học này.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                {studentsLoading ? (
                  <div className="p-12">
                    <AdminLoading message="Đang tải danh sách học viên..." />
                  </div>
                ) : studentsError ? (
                  <div className="p-6 text-center">
                    <p className="text-sm font-medium text-red-600">
                      {studentsError}
                    </p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="p-12 text-center">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Chưa có học viên nào
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Chưa có học viên nào được đăng ký vào khóa học này.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Họ và tên
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Email
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Trạng thái
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Hành động</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
                                    {`${student.firstName[0] || ""}${
                                      student.lastName[0] || ""
                                    }`}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {`${student.lastName} ${student.firstName}`}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {student.role === "student"
                                        ? "Học viên"
                                        : student.role === "teacher"
                                        ? "Giảng viên"
                                        : "Quản trị viên"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {student.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    student.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : student.status === "inactive"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.status === "active"
                                    ? "Đang hoạt động"
                                    : student.status === "inactive"
                                    ? "Tạm dừng"
                                    : "Bị khoá"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    {studentsTotalPages > 1 && (
                      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() =>
                              setStudentsPage((p) => Math.max(0, p - 1))
                            }
                            disabled={studentsPage === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Trước
                          </button>
                          <button
                            onClick={() =>
                              setStudentsPage((p) =>
                                Math.min(studentsTotalPages - 1, p + 1)
                              )
                            }
                            disabled={studentsPage >= studentsTotalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Sau
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Trang{" "}
                              <span className="font-medium">
                                {studentsPage + 1}
                              </span>{" "}
                              /{" "}
                              <span className="font-medium">
                                {studentsTotalPages}
                              </span>
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() =>
                                  setStudentsPage((p) => Math.max(0, p - 1))
                                }
                                disabled={studentsPage === 0}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Trước
                              </button>
                              <button
                                onClick={() =>
                                  setStudentsPage((p) =>
                                    Math.min(studentsTotalPages - 1, p + 1)
                                  )
                                }
                                disabled={
                                  studentsPage >= studentsTotalPages - 1
                                }
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Sau
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {materialToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-999999">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMaterialToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMaterial(materialToDelete)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseDetail;
