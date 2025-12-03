import { useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const mockCourses = [
  {
    id: "intro-ai",
    title: "Nhập môn Trí tuệ nhân tạo",
    role: "student",
    instructor: "TS. Nguyễn Huy",
    progress: 68,
    nextItem: "Hoàn thành Lab 03 về tìm kiếm heuristic",
    tags: ["AI", "Python", "Cơ bản"],
  },
  {
    id: "web-react",
    title: "Xây dựng SPA với React",
    role: "student",
    instructor: "Cô Lê Mỹ An",
    progress: 42,
    nextItem: "Xem video Hooks nâng cao",
    tags: ["React", "Frontend", "UI"],
  },
  {
    id: "ds-teach",
    title: "Thiết kế bài tập cấu trúc dữ liệu",
    role: "teacher",
    instructor: "Bạn phụ trách",
    progress: 85,
    nextItem: "Chấm 12 bài nộp tuần này",
    tags: ["Dạy học", "Chấm điểm", "ITS"],
  },
  {
    id: "ml-path",
    title: "Lộ trình Máy học 8 tuần",
    role: "teacher",
    instructor: "Bạn phụ trách",
    progress: 23,
    nextItem: "Tạo quiz tuần 2 và gợi ý lộ trình dự phòng",
    tags: ["Machine Learning", "Lộ trình", "Quiz"],
  },
];

const MyCourses = () => {
  const [viewRole, setViewRole] = useState<"student" | "teacher" | "all">(
    "all"
  );

  const filteredCourses = useMemo(() => {
    if (viewRole === "all") return mockCourses;
    return mockCourses.filter((course) => course.role === viewRole);
  }, [viewRole]);

  return (
    <>
      <PageMeta
        title="Khoá học của tôi"
        description="Tổng hợp khoá học cho sinh viên và giảng viên với tiến độ và hành động nhanh"
      />
      <PageBreadcrumb pageTitle="Khóa học của tôi" />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-card md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">Góc nhìn theo vai trò</p>
            <h2 className="text-xl font-semibold text-gray-900">
              Khoá học của tôi{" "}
              {viewRole !== "all"
                ? `- ${viewRole === "student" ? "Sinh viên" : "Giảng viên"}`
                : ""}
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1 text-sm font-semibold text-gray-700">
            {(
              [
                { key: "all", label: "Tất cả" },
                { key: "student", label: "Sinh viên" },
                { key: "teacher", label: "Giảng viên" },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                onClick={() => setViewRole(option.key)}
                className={`rounded-full px-3 py-1 transition ${
                  viewRole === option.key ? "bg-white text-gray-900 shadow" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    {course.role === "student" ? "Sinh viên" : "Giảng viên"}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  ITS gợi ý
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-700">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Tiến độ</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${
                      course.role === "student"
                        ? "bg-brand-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600">{course.nextItem}</p>
              </div>

              <div className="grid gap-2 text-sm md:grid-cols-3">
                <button className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                  Xem chi tiết
                </button>
                <button className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                  Tài liệu / File
                </button>
                <button className="rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                  Giao tiếp ITS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyCourses;
