import { useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface CoursePermission {
  id: string;
  name: string;
  instructor: string;
  requestedInstructor?: string;
  viewers: number;
  pendingViewers: number;
}

interface LearnerAccess {
  id: string;
  name: string;
  course: string;
  status: "active" | "pending";
}

const instructorPool = [
  "Nguyễn Hồng Hà",
  "Lê Mỹ An",
  "Trần Minh Quang",
  "Phạm Quỳnh Anh",
  "Đinh Gia Bảo",
];

const initialCourses: CoursePermission[] = [
  {
    id: "its-101",
    name: "Lập trình Web nâng cao",
    instructor: "Lê Mỹ An",
    requestedInstructor: "Nguyễn Hồng Hà",
    viewers: 312,
    pendingViewers: 8,
  },
  {
    id: "its-207",
    name: "Phân tích dữ liệu",
    instructor: "Trần Minh Quang",
    viewers: 185,
    pendingViewers: 0,
  },
  {
    id: "its-310",
    name: "Nhập môn AI",
    instructor: "Đinh Gia Bảo",
    pendingViewers: 2,
    viewers: 96,
  },
];

const initialLearners: LearnerAccess[] = [
  {
    id: "st-001",
    name: "Ngô Thùy Dương",
    course: "Lập trình Web nâng cao",
    status: "active",
  },
  {
    id: "st-014",
    name: "Huỳnh Tấn Sang",
    course: "Phân tích dữ liệu",
    status: "pending",
  },
  {
    id: "st-023",
    name: "Hoàng Ngọc Linh",
    course: "Nhập môn AI",
    status: "active",
  },
  {
    id: "st-045",
    name: "Trần Khôi",
    course: "Lập trình Web nâng cao",
    status: "pending",
  },
];

const AdminLearningContent = () => {
  const [courses, setCourses] = useState<CoursePermission[]>(initialCourses);
  const [learners, setLearners] = useState<LearnerAccess[]>(initialLearners);
  const [selectedCourse, setSelectedCourse] = useState<string>(
    initialCourses[0].id
  );
  const [newViewerEmail, setNewViewerEmail] = useState("");

  const summary = useMemo(() => {
    const totalViewers = courses.reduce((sum, c) => sum + c.viewers, 0);
    const pendingViewers = courses.reduce(
      (sum, c) => sum + c.pendingViewers,
      0
    );
    const pendingInstructorRequests = courses.filter(
      (c) => c.requestedInstructor
    ).length;

    return { totalViewers, pendingViewers, pendingInstructorRequests };
  }, [courses]);

  const handleInstructorChange = (courseId: string, instructor: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, instructor, requestedInstructor: undefined }
          : c
      )
    );
  };

  const handleApproveViewer = (learnerId: string) => {
    setLearners((prev) =>
      prev.map((l) => (l.id === learnerId ? { ...l, status: "active" } : l))
    );
    setCourses((prev) =>
      prev.map((course) =>
        course.name === learners.find((l) => l.id === learnerId)?.course
          ? {
              ...course,
              viewers: course.viewers + 1,
              pendingViewers: Math.max(0, course.pendingViewers - 1),
            }
          : course
      )
    );
  };

  const handleAddViewer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newViewerEmail.trim()) return;

    const course = courses.find((c) => c.id === selectedCourse);
    if (!course) return;

    setLearners((prev) => [
      ...prev,
      {
        id: `pending-${prev.length + 1}`,
        name: newViewerEmail,
        course: course.name,
        status: "pending",
      },
    ]);

    setCourses((prev) =>
      prev.map((c) =>
        c.id === selectedCourse
          ? { ...c, pendingViewers: c.pendingViewers + 1 }
          : c
      )
    );
    setNewViewerEmail("");
  };

  return (
    <>
      <PageMeta
        title="Phân quyền nội dung học tập"
        description="Quản trị quyền giảng dạy và quyền truy cập học liệu"
      />
      <PageBreadcrumb pageTitle="Phân quyền nội dung học tập" />
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Tổng lượt xem hợp lệ
            </p>
            <p className="mt-2 text-3xl font-bold text-brand-700">
              {summary.totalViewers.toLocaleString("vi-VN")}
            </p>
            <p className="text-sm text-gray-600">Đã được cấp quyền xem</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Yêu cầu chờ duyệt
            </p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {summary.pendingViewers}
            </p>
            <p className="text-sm text-gray-600">
              Cần xét duyệt quyền truy cập
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card dark:border-gray-800 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Đề xuất giảng viên mới
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {summary.pendingInstructorRequests}
            </p>
            <p className="text-sm text-gray-600">
              Các khóa học yêu cầu thay giảng viên
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Phân quyền giảng viên
              </h2>
              <p className="text-sm text-gray-600">
                Chỉ định giảng viên chịu trách nhiệm cho từng khóa học.
              </p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Quyền giảng dạy
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="px-4 py-3">Khóa học</th>
                  <th className="px-4 py-3">Giảng viên hiện tại</th>
                  <th className="px-4 py-3">Đề xuất thay đổi</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {course.name}
                      </p>
                      <p className="text-xs text-gray-500">Mã: {course.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-brand-100 text-center text-sm font-semibold leading-10 text-brand-700">
                          {course.instructor.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {course.instructor}
                          </p>
                          <p className="text-xs text-gray-500">
                            Quyền giảng dạy
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {course.requestedInstructor ? (
                        <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-700">
                          {course.requestedInstructor}
                        </div>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                          Không có
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <select
                          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          value={course.instructor}
                          onChange={(e) =>
                            handleInstructorChange(course.id, e.target.value)
                          }
                        >
                          {instructorPool.map((ins) => (
                            <option key={ins} value={ins}>
                              {ins}
                            </option>
                          ))}
                        </select>
                        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600">
                          Lưu thay đổi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chỉ định danh sách học viên
                </h3>
                <p className="text-sm text-gray-600">
                  Cấp quyền xem học liệu cho học viên cụ thể.
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                Danh sách
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {learners.map((learner) => (
                <div
                  key={learner.id}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {learner.name}
                      </p>
                      <p className="text-xs text-gray-500">{learner.course}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        learner.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {learner.status === "active"
                        ? "Đã cấp quyền"
                        : "Chờ duyệt"}
                    </span>
                  </div>
                  {learner.status === "pending" && (
                    <button
                      onClick={() => handleApproveViewer(learner.id)}
                      className="mt-2 rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
                    >
                      Duyệt quyền xem
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card dark:border-gray-800 dark:bg-white/5 lg:col-span-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cấp quyền xem nhanh
                </h3>
                <p className="text-sm text-gray-600">
                  Thêm học viên mới vào khóa học đang chọn.
                </p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                Tạo mới
              </span>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleAddViewer}>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Khóa học
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Email học viên
                  </label>
                  <input
                    type="email"
                    value={newViewerEmail}
                    onChange={(e) => setNewViewerEmail(e.target.value)}
                    placeholder="example@its.edu.vn"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Thêm vào danh sách chờ
                </button>
                <p className="text-sm text-gray-500">
                  Admin có thể duyệt ngay trong bảng bên cạnh.
                </p>
              </div>
            </form>

            <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Lưu ý</p>
              <ul className="list-disc pl-5">
                <li>
                  Chỉ định giảng viên trước khi mở quyền xem cho học viên.
                </li>
                <li>
                  Quyền xem được đồng bộ với tài liệu và bài tập của khóa học.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLearningContent;
