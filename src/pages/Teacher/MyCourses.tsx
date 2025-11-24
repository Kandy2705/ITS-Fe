import { Link, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import { PlusIcon } from '@heroicons/react/24/outline';

const teacherCourses = [
  {
    id: "ds-teach",
    title: "Thiết kế bài tập cấu trúc dữ liệu",
    instructor: "Bạn phụ trách",
    status: "published", // published, private, upcoming, draft
    progress: 85,
    nextItem: "Chấm 12 bài nộp tuần này",
    tags: ["Dạy học", "Chấm điểm", "ITS"],
    students: 45,
    pendingAssignments: 12,
  },
  {
    id: "ml-path",
    title: "Lộ trình Máy học 8 tuần",
    instructor: "Bạn phụ trách",
    status: "private",
    progress: 23,
    nextItem: "Tạo quiz tuần 2 và gợi ý lộ trình dự phòng",
    tags: ["Machine Learning", "Lộ trình", "Quiz"],
    students: 32,
    pendingAssignments: 5,
  },
  {
    id: "web-advanced",
    title: "Phát triển Web nâng cao",
    instructor: "Bạn phụ trách",
    status: "draft",
    progress: 60,
    nextItem: "Kiểm tra project giữa kỳ",
    tags: ["Web", "Fullstack", "Project"],
    students: 28,
    pendingAssignments: 8,
  },
];

const TeacherCourses = () => {
  const navigate = useNavigate();
  return (
    <>
      <PageMeta
        title="Quản lý khóa học giảng dạy"
        description="Theo dõi và quản lý các khóa học bạn đang giảng dạy"
      />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h1>
              <p className="text-gray-600">Quản lý và theo dõi các khóa học bạn đang giảng dạy</p>
            </div>
            <button
              onClick={() => navigate('/teacher/courses/new')}
              className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Tạo khóa học mới
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {teacherCourses.map((course) => (
            <div key={course.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase text-orange-500">
                      Giảng viên
                    </p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      course.status === 'published' ? 'bg-green-100 text-green-800' :
                      course.status === 'private' ? 'bg-blue-100 text-blue-800' :
                      course.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status === 'published' ? 'Công khai' :
                       course.status === 'private' ? 'Riêng tư' :
                       course.status === 'upcoming' ? 'Sắp ra mắt' : 'Bản nháp'}
                    </span>
                  </div>
                  <Link to={`/teacher/courses/${course.id}`} className="hover:text-orange-600 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {course.students} học viên
                  </div>
                  {course.pendingAssignments > 0 && (
                    <div className="mt-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      {course.pendingAssignments} bài chờ chấm
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
                  <span>Tiến độ giảng dạy</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Tiếp theo:</span> {course.nextItem}
                </p>
              </div>

              <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
                <Link 
                  to={`/teacher/courses/${course.id}`}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-orange-400 hover:bg-orange-50"
                >
                  Quản lý khóa học
                </Link>
                <Link 
                  to={`/teacher/courses/${course.id}?tab=grading`}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-orange-400 hover:bg-orange-50"
                >
                  Bài tập & Chấm điểm
                </Link>
                <Link 
                  to={`/teacher/courses/${course.id}?tab=interaction`}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold text-gray-800 transition hover:border-orange-400 hover:bg-orange-50"
                >
                  Tương tác học viên
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeacherCourses;
