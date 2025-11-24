import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

type Question = { prompt: string; points: number };

type QuizSettingsKey = "showAnswers" | "shuffle" | "history" | "negative";

const QuizBuilder = () => {
  const [title, setTitle] = useState("Quiz tuần 1");
  const [totalMarks, setTotalMarks] = useState("100");
  const [maxAttempts, setMaxAttempts] = useState("3");
  const [passing, setPassing] = useState("70");
  const [duration, setDuration] = useState("60");
  const [settings, setSettings] = useState<Record<QuizSettingsKey, boolean>>({
    showAnswers: false,
    shuffle: true,
    history: true,
    negative: false,
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const toggleSetting = (key: QuizSettingsKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        prompt: `Câu hỏi ${prev.length + 1}: Nhập nội dung câu hỏi...`,
        points: 10,
      },
    ]);
  };

  return (
    <>
      <PageMeta title="Quiz Builder" description="Tạo bài kiểm tra với cài đặt và câu hỏi" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-6 shadow-card md:flex-row md:items-center">
          <div>
            <p className="text-sm text-gray-500">Quizzes / New</p>
            <h1 className="text-2xl font-semibold text-gray-900">Thiết lập bài Quiz</h1>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Test Quiz
            </button>
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Kiểm tra bài nộp
            </button>
            <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-700">
              Lưu Quiz
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Chi tiết Quiz</h2>
            <span className="text-xs font-semibold text-gray-500">Draft</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-semibold text-gray-800">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-gray-800">
              Total Marks
              <input
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-gray-800">
              Maximum Attempts
              <input
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-gray-800">
              Passing Percentage
              <input
                value={passing}
                onChange={(e) => setPassing(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-gray-800">
              Duration (phút)
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {(
              [
                { key: "showAnswers", label: "Hiển thị đáp án" },
                { key: "shuffle", label: "Đảo câu hỏi" },
                { key: "history", label: "Xem lịch sử nộp" },
                { key: "negative", label: "Chấm điểm âm" },
              ] as const
            ).map((item) => (
              <label key={item.key} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800">
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  checked={settings[item.key]}
                  onChange={() => toggleSetting(item.key)}
                />
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Questions</h3>
              <button onClick={addQuestion} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold hover:border-brand-400 hover:bg-brand-50">
                + New Question
              </button>
            </div>

            {questions.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có câu hỏi nào.</p>
            ) : (
              <div className="space-y-3">
                {questions.map((q, index) => (
                  <div key={index} className="space-y-2 rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-gray-500">
                      <span>Câu hỏi #{index + 1}</span>
                      <span>{q.points} điểm</span>
                    </div>
                    <textarea
                      value={q.prompt}
                      onChange={(e) =>
                        setQuestions((prev) =>
                          prev.map((item, idx) => (idx === index ? { ...item, prompt: e.target.value } : item))
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                      <span>Số điểm</span>
                      <input
                        type="number"
                        value={q.points}
                        onChange={(e) =>
                          setQuestions((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, points: Number(e.target.value) || 0 } : item
                            )
                          )
                        }
                        className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Lưu nháp
            </button>
            <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-700">
              Xuất bản Quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizBuilder;
