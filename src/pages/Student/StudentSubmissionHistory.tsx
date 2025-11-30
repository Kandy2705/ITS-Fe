import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

interface SubmissionHistory {
  id: string;
  title: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
}

const historyAssignments: SubmissionHistory[] = [
  { id: "hs-01", title: "Bài tập 0 - Git flow", submittedAt: "02/08", score: 10, feedback: "Rất tốt" },
  { id: "hs-02", title: "Thiết kế DB", submittedAt: "25/07", score: 8, feedback: "Thiếu ràng buộc" },
  { id: "hs-03", title: "Viết báo cáo sprint", submittedAt: "15/07" },
];

const StudentSubmissionHistory = () => {
  return (
    <>
      <PageMeta
        title="Lịch sử nộp bài"
        description="Xem lại lịch sử nộp bài và phản hồi từ giảng viên"
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử nộp bài</h1>
          <p className="text-gray-600">Xem lại file đã nộp và phản hồi từ giảng viên</p>
        </div>
        <Link
          to="/student/content"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Quay lại bài tập
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
        <div className="space-y-4">
          {historyAssignments.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">Nộp ngày {item.submittedAt}</p>
                </div>
                {item.score && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {item.score} điểm
                  </span>
                )}
              </div>
              {item.feedback && (
                <div className="mt-2 rounded-lg bg-white p-3 text-sm text-gray-700">
                  <p className="font-medium">Nhận xét:</p>
                  <p>{item.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentSubmissionHistory;
