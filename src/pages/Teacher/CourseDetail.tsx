import { useMemo } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Link, useParams, useNavigate } from "react-router";

const lessons = [
  { title: "Giới thiệu khoá học", status: "done", duration: "15 phút", studentsCompleted: 24, totalStudents: 25 },
  { title: "Phân tích yêu cầu ITS", status: "in-progress", duration: "35 phút", studentsCompleted: 18, totalStudents: 25 },
  { title: "Dự báo lộ trình tự động", status: "locked", duration: "50 phút", studentsCompleted: 0, totalStudents: 25 },
  { title: "Thực hành: Cá nhân hoá quiz", status: "locked", duration: "60 phút", studentsCompleted: 0, totalStudents: 25 },
];

const assignments = [
  { 
    title: "Bài tập 1: Thiết kế module ITS", 
    type: "Bài tập lập trình", 
    due: "Hết hạn trong 2 ngày",
    submitted: 18,
    totalStudents: 25,
    averageScore: 8.2
  },
  { 
    title: "Quiz 1: Kiến thức nền", 
    type: "Trắc nghiệm", 
    due: "Hết hạn trong 5 ngày",
    submitted: 0,
    totalStudents: 25,
    averageScore: 0
  },
  { 
    title: "Dự án nhỏ: Lộ trình thích ứng", 
    type: "Dự án nhóm", 
    due: "Hết hạn trong 12 ngày",
    submitted: 0,
    totalStudents: 25,
    averageScore: 0
  },
];

const TeacherCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const title = useMemo(
    () => id ? `Quản lý khoá học: ${id}` : "Quản lý khoá học - Demo",
    [id]
  );

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <>
      <PageMeta
        title="Quản lý khoá học"
        description="Theo dõi và quản lý tiến độ học tập của sinh viên"
      />
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Khoá học dành cho giảng viên</p>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">
                Tổng quan về hiệu suất và tiến độ của lớp học.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-80">
              <div className="rounded-xl bg-brand-25 p-3 text-center">
                <p className="text-xs font-semibold uppercase text-brand-700">Sinh viên</p>
                <p className="text-2xl font-bold text-brand-700">25/25</p>
                <p className="text-xs text-gray-600">Đã đăng ký</p>
              </div>
              <div className="rounded-xl bg-green-50 p-3 text-center">
                <p className="text-xs font-semibold uppercase text-green-700">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-700">72%</p>
                <p className="text-xs text-gray-600">Trung bình lớp</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Thời gian học</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">Thứ 3,5,7 | 19:00 - 21:00</p>
              <p className="text-sm text-gray-600">Phòng học: Zoom 123-456-789</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Trạng thái lớp</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">Đang diễn ra</p>
              <p className="text-sm text-gray-600">Tuần 3/12 của khoá học</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Hỗ trợ</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">2 sinh viên cần hỗ trợ</p>
              <p className="text-sm text-gray-600">Thời gian học thấp</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Bài học & Tiến độ</h3>
                <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                  Thêm bài học mới
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {lessons.map((lesson) => (
                  <div key={lesson.title} className="group">
                    <Link
                      to={`/teacher/courses/${id}/files/${lesson.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                    >
                      <span
                        className={`h-8 w-8 rounded-full text-center text-xs font-bold leading-8 text-white ${
                          lesson.status === "done"
                            ? "bg-green-500"
                            : lesson.status === "in-progress"
                              ? "bg-orange-500"
                              : "bg-gray-300"
                        }`}
                      >
                        {lesson.status === "done"
                          ? lesson.studentsCompleted
                          : lesson.status === "in-progress"
                            ? `${lesson.studentsCompleted}/${lesson.totalStudents}`
                            : ""}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900">{lesson.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{lesson.duration}</span>
                            <button 
                              type="button"
                              className="text-sm font-semibold text-brand-600 hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Handle edit click
                              }}
                            >
                              Chỉnh sửa
                            </button>
                          </div>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-brand-600 h-2 rounded-full" 
                            style={{ width: `${getProgressPercentage(lesson.studentsCompleted, lesson.totalStudents)}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {getProgressPercentage(lesson.studentsCompleted, lesson.totalStudents)}% sinh viên đã hoàn thành
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Bài tập & Đánh giá</h3>
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                  Tạo bài tập mới
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment.title} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">{assignment.type}</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">Hạn chót: {assignment.due}</p>
                        <p className="mt-2 text-sm text-gray-700">
                          Đã nộp: {assignment.submitted}/{assignment.totalStudents} · 
                          Điểm TB: {assignment.averageScore > 0 ? assignment.averageScore.toFixed(1) : 'Chưa có'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          to={`/teacher/assignments/${assignment.title.toLowerCase().replace(/\s+/g, '-')}`}
                          className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                        >
                          Xem bài nộp
                        </Link>
                        <button className="rounded-lg bg-brand-600 px-3 py-1 text-sm font-semibold text-white">
                          Chấm điểm
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* <div className="rounded-2xl bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900">Thông báo gần đây</h3>
              <ul className="mt-3 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  <div>
                    <p>3 sinh viên chưa hoàn thành bài tập tuần 2.</p>
                    <button className="mt-1 text-xs font-semibold text-brand-600">Gửi nhắc nhở</button>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  <div>
                    <p>5 sinh viên có điểm dưới trung bình bài kiểm tra gần nhất.</p>
                    <button className="mt-1 text-xs font-semibold text-brand-600">Xem chi tiết</button>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  <div>
                    <p>2 sinh viên cần hỗ trợ: thời gian học thấp.</p>
                    <button className="mt-1 text-xs font-semibold text-brand-600">Xem thêm</button>
                  </div>
                </li>
              </ul>
            </div> */}

            <div className="rounded-2xl bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900">Công cụ giảng dạy</h3>
              <div className="mt-3 space-y-2 text-sm">
                <button 
                  className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50"
                  onClick={() => navigate(`/lms/courses/${id}/files/new`)}
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tạo bài giảng mới
                </button>
                <Link 
                  to={`/teacher/courses/${id}/files/upload`}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Thêm tài liệu
                </Link>
                <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Quản lý học viên
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherCourseDetail;
