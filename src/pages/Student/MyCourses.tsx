import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const studentCourses = [
  {
    id: "intro-ai",
    title: "Nhập môn Trí tuệ nhân tạo",
    instructor: "TS. Nguyễn Huy",
    progress: 68,
    nextItem: "Hoàn thành Lab 03 về tìm kiếm heuristic",
    tags: ["AI", "Python", "Cơ bản"],
    upcomingDeadline: "10/12/2023",
    pendingTasks: 3,
  },
  {
    id: "web-react",
    title: "Xây dựng SPA với React",
    instructor: "Cô Lê Mỹ An",
    progress: 42,
    nextItem: "Xem video Hooks nâng cao",
    tags: ["React", "Frontend", "UI"],
    upcomingDeadline: "15/12/2023",
    pendingTasks: 2,
  },
  {
    id: "data-science",
    title: "Khoa học dữ liệu cơ bản",
    instructor: "TS. Trần Văn Bình",
    progress: 35,
    nextItem: "Hoàn thành bài tập phân tích dữ liệu",
    tags: ["Data Science", "Python", "Pandas"],
    upcomingDeadline: "05/12/2023",
    pendingTasks: 4,
  },
];

const StudentCourses = () => {
  return (
    <>
      <PageMeta
        title="Khóa học của tôi"
        description="Theo dõi tiến độ học tập và các khóa học đang tham gia"
      />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-card">
          <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h1>
          <p className="text-gray-600">Theo dõi tiến độ và các hoạt động học tập của bạn</p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {studentCourses.map((course) => (
            <div key={course.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-brand-600">
                    Sinh viên
                  </p>
                  <Link to={`/student/courses/${course.id}`} className="hover:text-brand-600 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                    Đang học
                  </div>
                  {course.pendingTasks > 0 && (
                    <div className="mt-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {course.pendingTasks} bài tập đang chờ
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-700">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Tiến độ học tập</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Tiếp theo:</span> {course.nextItem}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Hạn chót:</span> {course.upcomingDeadline}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
                <Link 
                  to={`/student/courses/${course.id}`}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  Tiếp tục học
                </Link>
                <Link 
                  to={`/student/courses/${course.id}?tab=assignments`}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  Bài tập
                </Link>
                <Link 
                  to={`/student/courses/${course.id}?tab=materials`}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  Tài liệu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentCourses;
