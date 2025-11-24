import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

type TestCase = { input: string; output: string };

const ExerciseCreator = () => {
  const [title, setTitle] = useState("Lập trình nâng cao");
  const [language, setLanguage] = useState("Python");
  const [problem, setProblem] = useState("Viết hàm tính tổng dãy số Fibonacci cho N.");
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "3", output: "2" },
    { input: "6", output: "8" },
  ]);

  const addRow = () => {
    setTestCases((prev) => [...prev, { input: "", output: "" }]);
  };

  const updateRow = (index: number, key: keyof TestCase, value: string) => {
    setTestCases((prev) => prev.map((row, idx) => (idx === index ? { ...row, [key]: value } : row)));
  };

  return (
    <>
      <PageMeta title="Bài tập lập trình" description="Tạo bài tập lập trình kèm test case" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-6 shadow-card md:flex-row md:items-center">
          <div>
            <p className="text-sm text-gray-500">Exercises / New</p>
            <h1 className="text-2xl font-semibold text-gray-900">Tạo bài lập trình</h1>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Hủy
            </button>
            <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-700">
              Lưu bài tập
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create Programming Exercise</h2>
              <p className="text-sm text-gray-600">Nhập mô tả bài toán, ngôn ngữ và test case để kiểm tra.</p>
            </div>
            <button className="text-sm font-semibold text-gray-500">×</button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-gray-800">
              Tiêu đề *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-gray-800">
              Ngôn ngữ
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
              >
                {[
                  "Python",
                  "Java",
                  "C++",
                  "JavaScript",
                  "Go",
                ].map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-2 text-sm font-semibold text-gray-800">
            Problem Statement *
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="min-h-[140px] w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Test Cases</h3>
              <button onClick={addRow} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold hover:border-brand-400 hover:bg-brand-50">
                + Add Row
              </button>
            </div>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold uppercase text-gray-500">
                <span>Input</span>
                <span>Kết quả mong đợi</span>
              </div>
              {testCases.map((row, index) => (
                <div key={index} className="grid grid-cols-2 gap-3">
                  <input
                    value={row.input}
                    onChange={(e) => updateRow(index, "input", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Giá trị đầu vào"
                  />
                  <input
                    value={row.output}
                    onChange={(e) => updateRow(index, "output", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none"
                    placeholder="Kết quả trả về"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Test this exercise
            </button>
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Check submission
            </button>
            <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-700">
              Lưu & xuất bản
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExerciseCreator;
