import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

type MaterialFormat = "pdf" | "video" | "slide" | "link";

type Visibility = "public" | "hidden";

interface MaterialItem {
  id: string;
  title: string;
  format: MaterialFormat;
  uploadedAt: string;
  status: "draft" | "published";
  visibility: Visibility;
}

interface AssignmentSubmission {
  id: string;
  student: string;
  fileName: string;
  score?: number;
  comment?: string;
  submittedAt: string;
}

interface AssignmentItem {
  id: string;
  title: string;
  dueDate: string;
  submissions: AssignmentSubmission[];
}

const materialLabels: Record<MaterialFormat, string> = {
  pdf: "PDF",
  video: "Video",
  slide: "Slide",
  link: "Đường dẫn",
};

const formatBadges: Record<MaterialFormat, string> = {
  pdf: "bg-red-100 text-red-700",
  video: "bg-indigo-100 text-indigo-700",
  slide: "bg-amber-100 text-amber-700",
  link: "bg-emerald-100 text-emerald-700",
};

const initialMaterials: MaterialItem[] = [
  {
    id: "mt-101",
    title: "Bài giảng tuần 1 - Kiến trúc RESTful",
    format: "pdf",
    uploadedAt: "Hôm qua",
    status: "published",
    visibility: "public",
  },
  {
    id: "mt-202",
    title: "Video demo triển khai API",
    format: "video",
    uploadedAt: "2 ngày trước",
    status: "published",
    visibility: "public",
  },
  {
    id: "mt-305",
    title: "Slide ôn tập giữa kỳ",
    format: "slide",
    uploadedAt: "5 ngày trước",
    status: "draft",
    visibility: "hidden",
  },
];

const initialAssignments: AssignmentItem[] = [
  {
    id: "as-01",
    title: "Bài tập 1 - Thiết kế API", 
    dueDate: "15/08/2024",
    submissions: [
      { id: "sb-001", student: "Nguyễn Thu Trang", fileName: "api-design.pdf", score: 9, comment: "Cấu trúc rõ ràng", submittedAt: "12/08" },
      { id: "sb-002", student: "Lưu Minh Phong", fileName: "api.docx", submittedAt: "Chưa nộp" },
    ],
  },
  {
    id: "as-02",
    title: "Bài tập 2 - Tối ưu truy vấn", 
    dueDate: "22/08/2024",
    submissions: [],
  },
];

const TeacherLearningContent = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(initialAssignments);
  // const [newMaterial, setNewMaterial] = useState({ title: "", format: "pdf" as MaterialFormat });
  const [gradingNote, setGradingNote] = useState<Record<string, string>>({});
  // const publishedCount = useMemo(() => materials.filter((m) => m.status === "published").length, [materials]);

  const toggleVisibility = (id: string) => {
    setMaterials((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, visibility: item.visibility === "public" ? "hidden" : "public" }
          : item
      )
    );
  };

  const handlePublish = (id: string) => {
    setMaterials((prev) => prev.map((item) => (item.id === id ? { ...item, status: "published" } : item)));
  };

  const handleDelete = (id: string) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  // const handleUpload = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (!newMaterial.title.trim()) return;

  //   setMaterials((prev) => [
  //     ...prev,
  //     {
  //       id: `mt-${prev.length + 1}`,
  //       title: newMaterial.title,
  //       format: newMaterial.format,
  //       uploadedAt: "Vừa xong",
  //       status: "draft",
  //       visibility: "hidden",
  //     },
  //   ]);
  //   setNewMaterial({ title: "", format: "pdf" });
  // };

  const handleScore = (assignmentId: string, submissionId: string, score: number) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              submissions: assignment.submissions.map((submission) =>
                submission.id === submissionId ? { ...submission, score } : submission
              ),
            }
          : assignment
      )
    );
  };

  const handleComment = (assignmentId: string, submissionId: string) => {
    const note = gradingNote[submissionId];
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId
          ? {
              ...assignment,
              submissions: assignment.submissions.map((submission) =>
                submission.id === submissionId ? { ...submission, comment: note } : submission
              ),
            }
          : assignment
      )
    );
  };

  return (
    <>
      <PageMeta
        title="Quản lý học liệu và bài tập"
        description="Giảng viên đăng tải, chỉnh sửa tài liệu và quản lý bài tập nộp của sinh viên"
      />

      {/* <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase text-gray-500">Tài liệu đã xuất bản</p>
          <p className="mt-2 text-3xl font-bold text-brand-700">{publishedCount}</p>
          <p className="text-sm text-gray-600">Có {materials.length - publishedCount} bản nháp chờ cập nhật</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase text-gray-500">Bài tập đang giao</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{assignments.length}</p>
          <p className="text-sm text-gray-600">Điều chỉnh hạn nộp trực tiếp trên bảng</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase text-gray-500">Bài nộp cần chấm</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {assignments.reduce((sum, item) => sum + item.submissions.filter((s) => !s.score).length, 0)}
          </p>
          <p className="text-sm text-gray-600">Thêm nhận xét trực tiếp cho từng bài</p>
        </div>
      </div> */}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tài liệu học tập</h2>
                <p className="text-sm text-gray-600">Đăng tải, cập nhật, xoá hoặc ẩn/hiện học liệu.</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Quản lý</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500">
                    <th className="px-4 py-3">Tiêu đề</th>
                    <th className="px-4 py-3">Định dạng</th>
                    <th className="px-4 py-3">Ngày đăng</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Hiển thị</th>
                    <th className="px-4 py-3">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {materials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{material.title}</p>
                        <p className="text-xs text-gray-500">Mã tài liệu: {material.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${formatBadges[material.format]}`}>
                          {materialLabels[material.format]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{material.uploadedAt}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            material.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {material.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleVisibility(material.id)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                            material.visibility === "public"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {material.visibility === "public" ? "Đang hiện" : "Đang ẩn"}
                        </button>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        {material.status === "draft" && (
                          <button
                            onClick={() => handlePublish(material.id)}
                            className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-600"
                          >
                            Xuất bản
                          </button>
                        )}
                        <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-brand-500 hover:text-brand-600">
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Quản lý bài tập</h2>
                <p className="text-sm text-gray-600">Điều chỉnh hạn nộp, chấm điểm và nhận xét.</p>
              </div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">Bài tập</span>
            </div>

            <div className="mt-4 space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500">Mã: {assignment.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-600">Hạn nộp</label>
                      <input
                        type="date"
                        value={assignment.dueDate.split("/").reverse().join("-")}
                        onChange={(e) =>
                          setAssignments((prev) =>
                            prev.map((item) =>
                              item.id === assignment.id
                                ? { ...item, dueDate: e.target.value.split("-").reverse().join("/") }
                                : item
                            )
                          )
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    {assignment.submissions.length === 0 ? (
                      <p className="text-sm text-gray-500">Chưa có bài nộp. Hệ thống sẽ hiện tại đây khi sinh viên tải lên.</p>
                    ) : (
                      assignment.submissions.map((submission) => (
                        <div key={submission.id} className="rounded-lg bg-white p-3 shadow-sm">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{submission.student}</p>
                              <p className="text-xs text-gray-500">File: {submission.fileName}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="number"
                                placeholder="Điểm"
                                value={submission.score ?? ""}
                                onChange={(e) => handleScore(assignment.id, submission.id, Number(e.target.value))}
                                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                              />
                              <input
                                type="text"
                                placeholder="Nhận xét"
                                value={gradingNote[submission.id] ?? submission.comment ?? ""}
                                onChange={(e) => setGradingNote((prev) => ({ ...prev, [submission.id]: e.target.value }))}
                                className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                              />
                              <button
                                onClick={() => handleComment(assignment.id, submission.id)}
                                className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
                              >
                                Lưu nhận xét
                              </button>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Nộp lúc: {submission.submittedAt}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Đăng tải học liệu mới</h3>
              <p className="text-sm text-gray-600">Tạo và quản lý tài liệu học tập của bạn</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Mới</span>
          </div>

          <div className="mt-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
              <svg
                className="h-10 w-10 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Bắt đầu tải lên</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tạo tài liệu mới, tải lên video, hoặc thêm liên kết học tập.
            </p>
            <div className="mt-6">
              <a
                href="/teacher/content/upload"
                className="inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Tạo học liệu mới
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-900">Các bước nhanh</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-3.5 w-3.5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium">Chọn định dạng</span> phù hợp với nội dung của bạn
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-3.5 w-3.5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium">Tải lên tệp</span> hoặc nhập liên kết
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-3.5 w-3.5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  <span className="font-medium">Xuất bản</span> khi đã sẵn sàng
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherLearningContent;
