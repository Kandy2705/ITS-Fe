import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";

const initialCourses = ["Nhập môn AI", "React cho người mới", "Phân tích dữ liệu"]; 
const initialMembers = ["Nguyễn Huy", "Lê Mỹ An", "Trần Minh"];

const ProgramBuilder = () => {
  const [courses, setCourses] = useState<string[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  const [title, setTitle] = useState("Chương trình mới");
  const [enforceOrder, setEnforceOrder] = useState(false);
  const [published, setPublished] = useState(false);

  const addCourse = () => {
    const next = initialCourses[courses.length % initialCourses.length];
    setCourses((prev) => [...prev, next]);
  };

  const addMember = () => {
    const next = initialMembers[members.length % initialMembers.length];
    setMembers((prev) => [...prev, next]);
  };

  return (
    <>
      <PageMeta title="Tạo chương trình" description="Tạo lộ trình gồm nhiều khoá học và thành viên" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-6 shadow-card md:flex-row md:items-center">
          <div>
            <p className="text-sm text-gray-500">Programs / Create</p>
            <h1 className="text-2xl font-semibold text-gray-900">Tạo chương trình học</h1>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Huỷ bỏ
            </button>
            <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-700">
              Lưu chương trình
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create Program</h2>
              <p className="text-sm text-gray-600">Thiết lập khoá học dạng lộ trình, thêm khoá học và thành viên.</p>
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
            <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-gray-800">
              <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  checked={published}
                  onChange={() => setPublished((prev) => !prev)}
                />
                Published
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  checked={enforceOrder}
                  onChange={() => setEnforceOrder((prev) => !prev)}
                />
                Enforce course order
              </label>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Courses</p>
                <button onClick={addCourse} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold hover:border-brand-400 hover:bg-brand-50">
                  + Add
                </button>
              </div>
              {courses.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa thêm khoá học nào.</p>
              ) : (
                <div className="space-y-2">
                  {courses.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
                      <span>{item}</span>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Members</p>
                <button onClick={addMember} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold hover:border-brand-400 hover:bg-brand-50">
                  + Add
                </button>
              </div>
              {members.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có thành viên nào.</p>
              ) : (
                <div className="space-y-2">
                  {members.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
                      <span>{item}</span>
                      <span className="text-xs text-gray-500">Thành viên #{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
              Lưu nháp
            </button>
            <button className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-700">
              Xuất bản chương trình
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramBuilder;
