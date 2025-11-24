import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const lessons = [
  { 
    title: "Giới thiệu khoá học", 
    status: "done", 
    duration: "15 phút",
    completed: true,
    score: 9.5,
    feedback: "Tốt, bạn đã nắm vững kiến thức cơ bản"
  },
  { 
    title: "Phân tích yêu cầu ITS", 
    status: "in-progress", 
    duration: "35 phút",
    completed: false,
    score: null,
    feedback: "Đang thực hiện..."
  },
  { 
    title: "Dự báo lộ trình tự động", 
    status: "locked", 
    duration: "50 phút",
    completed: false,
    score: null,
    feedback: "Sẽ mở sau khi hoàn thành bài trước"
  },
  { 
    title: "Thực hành: Cá nhân hoá quiz", 
    status: "locked", 
    duration: "60 phút",
    completed: false,
    score: null,
    feedback: "Sẽ mở sau khi hoàn thành bài trước"
  },
];

const assignments = [
  { 
    id: 1,
    title: "Bài tập 1: Thiết kế module ITS", 
    type: "Bài tập lập trình", 
    due: "Còn 2 ngày",
    status: "not-submitted",
    score: null,
    submitted: false
  },
  { 
    id: 2,
    title: "Quiz 1: Kiến thức nền", 
    type: "Trắc nghiệm", 
    due: "Còn 5 ngày",
    status: "not-started",
    score: null,
    submitted: false
  },
  { 
    id: 3,
    title: "Dự án nhỏ: Lộ trình thích ứng", 
    type: "Dự án nhóm", 
    due: "Còn 12 ngày",
    status: "not-started",
    score: null,
    submitted: false
  },
];

const StudentCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const title = useMemo(
    () => id ? `Khoá học của tôi: ${id}` : "Khoá học của tôi - Demo",
    [id]
  );

  const progress = 42; // Example progress percentage
  const nextLesson = "Phân tích yêu cầu ITS";
  const timeSpent = "8 giờ 45 phút";
  const rank = "Top 30%";

  return (
    <>
      <PageMeta
        title="Khoá học của tôi"
        description="Theo dõi tiến độ học tập và nhiệm vụ của bạn"
      />
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Khoá học dành cho sinh viên</p>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">
                Chào mừng bạn quay trở lại! Bài học tiếp theo của bạn là: {nextLesson}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-80">
              <div className="rounded-xl bg-brand-25 p-3 text-center">
                <p className="text-xs font-semibold uppercase text-brand-700">Tiến độ</p>
                <p className="text-2xl font-bold text-brand-700">{progress}%</p>
                <p className="text-xs text-gray-600">Đang học tuần 3/6</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-center">
                <p className="text-xs font-semibold uppercase text-blue-700">Xếp hạng</p>
                <p className="text-2xl font-bold text-blue-700">{rank}</p>
                <p className="text-xs text-gray-600">Trong lớp học</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Bài học tiếp theo</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{nextLesson}</p>
              <p className="text-sm text-gray-600">Bắt đầu ngay</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Thời gian học</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">{timeSpent}</p>
              <p className="text-sm text-gray-600">Tổng thời gian học tập</p>
            </div>
            {/* <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Hỗ trợ</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">Cần giúp đỡ?</p>
              <p className="text-sm text-gray-600">Đặt lịch hẹn với giảng viên</p>
            </div> */}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Tiến độ học tập</h3>
                <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                  Xem lộ trình chi tiết
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {lessons.map((lesson, index) => (
                  <div 
                    key={index}
                    className={`group flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                      lesson.status === 'in-progress' 
                        ? 'border-brand-300 bg-brand-50 hover:border-brand-400' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (lesson.status !== 'locked') {
                        navigate(`/student/courses/${id}/files/${lesson.title.toLowerCase().replace(/\s+/g, '-')}`);
                      }
                    }}
                    style={{ cursor: lesson.status === 'locked' ? 'not-allowed' : 'pointer' }}
                  >
                    <span
                      className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        lesson.completed
                          ? 'bg-green-500'
                          : lesson.status === 'in-progress'
                          ? 'bg-orange-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      {lesson.completed ? '✓' : index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{lesson.title}</p>
                          <p className="text-sm text-gray-600">{lesson.duration} • {lesson.status === 'in-progress' ? 'Đang học' : lesson.completed ? 'Đã hoàn thành' : 'Chưa mở'}</p>
                        </div>
                        {lesson.completed && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                            {lesson.score}/10
                          </span>
                        )}
                      </div>
                      {lesson.completed && (
                        <div className="mt-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-700">
                          <p className="font-medium">Nhận xét:</p>
                          <p>"{lesson.feedback}"</p>
                        </div>
                      )}
                      <div className="mt-2 flex gap-2">
                        <button
                          className={`rounded-lg px-3 py-1 text-sm font-medium ${
                            lesson.status === 'in-progress'
                              ? 'bg-brand-600 text-white hover:bg-brand-700'
                              : lesson.completed
                              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={lesson.status === 'locked'}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (lesson.status !== 'locked') {
                              navigate(`/student/courses/${id}/files/${lesson.title.toLowerCase().replace(/\s+/g, '-')}`);
                            }
                          }}
                        >
                          {lesson.completed ? 'Xem lại' : lesson.status === 'in-progress' ? 'Tiếp tục' : 'Bắt đầu'}
                        </button>
                        {/* {lesson.completed && (
                          <button className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Tải chứng chỉ
                          </button>
                        )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nhiệm vụ & Bài tập</h3>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  Hạn chót sắp tới
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {assignments.map((assignment) => (
                  <div 
                    key={assignment.id}
                    className="rounded-xl border border-gray-200 p-4 hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">{assignment.type}</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">Hạn chót: {assignment.due}</p>
                        {assignment.status === 'submitted' ? (
                          <p className="mt-2 text-sm text-green-600">Đã nộp • Chờ chấm điểm</p>
                        ) : assignment.status === 'graded' ? (
                          <p className="mt-2 text-sm text-gray-700">Điểm: <span className="font-semibold">{assignment.score}/10</span></p>
                        ) : (
                          <p className="mt-2 text-sm text-orange-600">Chưa nộp</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className={`rounded-lg px-3 py-1 text-sm font-medium ${
                            assignment.submitted
                              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-brand-600 text-white hover:bg-brand-700'
                          }`}
                        >
                          {assignment.submitted ? 'Đã nộp' : 'Nộp bài'}
                        </button>
                        <button 
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/student/courses/${id}/assignments/${assignment.id}`);
                          }}
                        >
                          Chi tiết
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
                    <p>Bài tập 1 sắp đến hạn nộp trong 2 ngày nữa.</p>
                    <button className="mt-1 text-xs font-semibold text-brand-600">Xem chi tiết</button>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  <div>
                    <p>Bài kiểm tra giữa kỳ sẽ diễn ra vào tuần tới.</p>
                    <button className="mt-1 text-xs font-semibold text-brand-600">Ôn tập ngay</button>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  <div>
                    <p>Giảng viên đã đăng tài liệu mới cho bài học tuần 3.</p>
                    <button className="mt-1 text-xs font-semibold text-brand-600">Tải xuống</button>
                  </div>
                </li>
              </ul>
            </div> */}

            <div className="rounded-2xl bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900">Tài nguyên học tập</h3>
              <div className="mt-3 space-y-2 text-sm">
                <Link 
                  to={`/student/courses/${id}/materials`}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tài liệu khóa học
                </Link>
                <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hướng dẫn học tập
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tài liệu tham khảo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCourseDetail;
