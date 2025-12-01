import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import {
  FiSearch,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { Link } from "react-router-dom";

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

const learningMaterials: LearningMaterial[] = [
  {
    id: "c1",
    courseInstanceId: "ci-1",
    title: "Giới thiệu khoá học",
    description: "Tổng quan về mục tiêu, phạm vi và cách sử dụng hệ thống ITS.",
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
    description:
      "Bài đọc về stakeholder, functional và non-functional requirements.",
    type: "reading",
    status: "active",
    orderIndex: 2,
    dueDate: "2025-12-10T23:59:59Z", // ví dụ: chỉ xem được tới ngày này
    allowAt: "2025-12-01T00:00:00Z",
    allowedLate: true,
    createdAt: "2025-11-26T09:00:00Z",
    updatedAt: "2025-11-26T09:00:00Z",
  },
  {
    id: "c3",
    courseInstanceId: "ci-1",
    title: "Video: Dự báo lộ trình tự động",
    description:
      "Video giải thích thuật toán recommendation cho lộ trình học thích ứng.",
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

const comments = [
  {
    name: "Bạn",
    role: "Sinh viên",
    avatar: "B",
    time: "5 phút trước",
    text: "Tài liệu rất hữu ích, nhưng phần 2.3 hơi khó hiểu.",
    isMe: true,
  },
  {
    name: "Nguyễn Văn A",
    role: "Sinh viên",
    avatar: "A",
    time: "2 giờ trước",
    text: "Ai giải thích giúp mình phần 3.2 với ạ?",
    isMe: false,
  },
  {
    name: "Trần Thị B",
    role: "Sinh viên",
    avatar: "T",
    time: "3 giờ trước",
    text: "Tôi cũng đang thắc mắc phần đó. @Nguyễn Văn A chúng ta có thể thảo luận thêm không?",
    isMe: false,
  },
  {
    name: "ITS Bot",
    role: "Hỗ trợ AI",
    avatar: "AI",
    time: "Hôm qua",
    text: "Dựa trên tiến độ của bạn, tôi đề xuất xem kỹ phần 2.3 và làm bài tập liên quan để hiểu sâu hơn.",
    isMe: false,
  },
];

type SortOption = "newest" | "oldest";

const StudentCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, you would add the comment to the state or send it to an API
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  const filteredAndSortedMaterials = useMemo(() => {
    let result = [...learningMaterials];

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
  }, [searchQuery, sortBy]);

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
        description="Theo dõi tiến độ học tập và nhiệm vụ của bạn"
      />

      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Link to="/student/courses" className="hover:text-brand-600">
          Khóa học của tôi
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Nhập môn điện toán</span>
      </div>

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
              <div className="mt-4 space-y-4">
                {filteredAndSortedMaterials.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Không tìm thấy tài liệu
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc
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
                          {material.orderIndex}
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

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Diễn đàn</h3>
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                B
              </div>
              <div className="flex-1">
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder="Đặt câu hỏi hoặc bình luận về tài liệu này..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex gap-2"></div>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-600 px-12 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
                    disabled={!newComment.trim()}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            {comments.map((comment, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 ${
                  comment.isMe
                    ? "border-brand-200 bg-brand-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-semibold ${
                      comment.isMe
                        ? "bg-brand-100 text-brand-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {comment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comment.role} • {comment.time}
                        </p>
                      </div>
                      {comment.isMe && (
                        <span className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800">
                          Bạn
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700">{comment.text}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <button
                        className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-gray-100"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <svg
                          className={`h-4 w-4 ${
                            isLiked ? "text-brand-600 fill-current" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              isLiked
                                ? "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                : "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            }
                          />
                        </svg>
                        <span>{isLiked ? "Đã thích" : "Thích"}</span>
                      </button>
                      <button className="rounded-full px-2 py-1 hover:bg-gray-100">
                        Trả lời
                      </button>
                      {!comment.isMe && (
                        <button className="ml-auto rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCourseDetail;
