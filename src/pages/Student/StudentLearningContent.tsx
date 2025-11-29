import { useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

interface AssignmentItem {
  id: string;
  title: string;
  status: "pending" | "submitted" | "graded";
  dueDate: string;
  score?: number;
  feedback?: string;
}

const currentAssignments: AssignmentItem[] = [
  { id: "as-01", title: "Thiết kế API", status: "submitted", dueDate: "15/08", score: 9, feedback: "Tổ chức rõ" },
  { id: "as-02", title: "Tối ưu truy vấn", status: "pending", dueDate: "22/08" },
  { id: "as-03", title: "Viết tài liệu Swagger", status: "graded", dueDate: "10/08", score: 8.5, feedback: "Thiếu ví dụ" },
];

const StudentLearningContent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<string>(currentAssignments[1].id);

  const handleUpload = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    alert(`Đã tải lên ${selectedFile.name} cho bài ${selectedAssignment} với ghi chú: ${comment}`);
    setSelectedFile(null);
    setComment("");
  };

  return (
    <>
      <PageMeta
        title="Bài tập và học liệu"
        description="Sinh viên làm bài tập trong tài liệu, xem lịch sử nộp và tải lên bài làm của mình"
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bài tập của tôi</h1>
          <p className="text-gray-600">Xem và nộp bài tập được giao</p>
        </div>
        <Link
          to="/student/submissions"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          Xem lịch sử nộp bài
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase text-gray-500">Bài tập cần nộp</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">
            {currentAssignments.filter((item) => item.status === "pending").length}
          </p>
          <p className="text-sm text-gray-600">Kiểm tra hạn nộp bên dưới</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase text-gray-500">Bài đã nộp</p>
          <p className="mt-2 text-3xl font-bold text-brand-700">
            {currentAssignments.filter((item) => item.status !== "pending").length}
          </p>
          <p className="text-sm text-gray-600">Đang chờ chấm điểm</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase text-gray-500">Điểm trung bình</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {(
              currentAssignments
                .filter((item) => typeof item.score === "number")
                .reduce((sum, item) => sum + (item.score || 0), 0) /
                (currentAssignments.filter((item) => typeof item.score === "number").length || 1)
            ).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Cập nhật sau mỗi lần chấm</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Bài tập hiện tại</h2>
                <p className="text-sm text-gray-600">Làm bài trong tài liệu hoặc tải file nộp.</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Đang học</span>
            </div>

            <div className="mt-4 space-y-3">
              {currentAssignments.map((assignment) => (
                <div key={assignment.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500">Mã: {assignment.id} • Hạn: {assignment.dueDate}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        assignment.status === "graded"
                          ? "bg-emerald-100 text-emerald-700"
                          : assignment.status === "submitted"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {assignment.status === "graded"
                        ? "Đã chấm"
                        : assignment.status === "submitted"
                        ? "Đã nộp"
                        : "Chưa nộp"}
                    </span>
                  </div>

                  {assignment.score && (
                    <p className="mt-2 text-sm text-gray-700">Điểm: {assignment.score} • Nhận xét: {assignment.feedback}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Lịch sử nộp bài</h2>
                <p className="text-sm text-gray-600">Xem lại tất cả bài đã nộp và phản hồi</p>
              </div>
              <Link
                to="/student/submissions"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {currentAssignments
                .filter(item => item.status !== 'pending')
                .slice(0, 2)
                .map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">Hạn: {item.dueDate}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'graded' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {item.status === 'graded' ? 'Đã chấm' : 'Đã nộp'}
                      </span>
                    </div>
                    {item.score && (
                      <p className="mt-2 text-sm text-gray-700">
                        Điểm: {item.score} {item.feedback && `• ${item.feedback}`}
                      </p>
                    )}
                  </div>
                ))}
              {currentAssignments.filter(item => item.status !== 'pending').length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-500">Chưa có bài tập nào đã nộp</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tải lên bài tập</h3>
              <p className="text-sm text-gray-600">Chọn bài cần nộp và đính kèm file, ghi chú.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Nộp bài</span>
          </div>

          <form className="mt-4 space-y-3" onSubmit={handleUpload}>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Chọn bài tập</label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {currentAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Tệp bài làm</label>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700"
                />
                <p className="text-xs text-gray-500">Hỗ trợ PDF, DOCX, ZIP.</p>
                {selectedFile && <p className="mt-1 text-sm text-gray-700">Đã chọn: {selectedFile.name}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Ghi chú cho giảng viên</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Ví dụ: Em sử dụng framework FastAPI"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Tải lên bài làm
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentLearningContent;
