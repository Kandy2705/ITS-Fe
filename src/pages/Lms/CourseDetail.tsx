import { useMemo } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const lessons = [
  { title: "Giới thiệu khoá học", status: "done", duration: "15 phút" },
  { title: "Phân tích yêu cầu ITS", status: "in-progress", duration: "35 phút" },
  { title: "Dự báo lộ trình tự động", status: "locked", duration: "50 phút" },
  { title: "Thực hành: Cá nhân hoá quiz", status: "locked", duration: "60 phút" },
];

const tasks = [
  { title: "Bài tập 1: Thiết kế module ITS", type: "Bài tập lập trình", due: "Còn 2 ngày" },
  { title: "Quiz 1: Kiến thức nền", type: "Trắc nghiệm", due: "Còn 5 ngày" },
  { title: "Dự án nhỏ: Lộ trình thích ứng", type: "Dự án nhóm", due: "Còn 12 ngày" },
];

const CourseDetail = () => {
  const { id } = useParams();

  const title = useMemo(
    () =>
      id
        ? `Chi tiết khoá học: ${id}`
        : "Chi tiết khoá học - Demo",
    [id]
  );

  return (
    <>
      <PageMeta
        title="Chi tiết khoá học"
        description="Xem tiến độ, bài học và nhiệm vụ của sinh viên/giảng viên"
      />
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Khoá học dành cho sinh viên & giảng viên</p>
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">
                ITS đang dự đoán lộ trình dựa trên mức độ hoàn thành và đề xuất nội dung bổ sung.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-80">
              <div className="rounded-xl bg-brand-25 p-3 text-center">
                <p className="text-xs font-semibold uppercase text-brand-700">Tiến độ</p>
                <p className="text-2xl font-bold text-brand-700">72%</p>
                <p className="text-xs text-gray-600">Đang học tuần 3/6</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-center">
                <p className="text-xs font-semibold uppercase text-orange-700">Độ khó</p>
                <p className="text-2xl font-bold text-orange-700">Vừa</p>
                <p className="text-xs text-gray-600">Có thể điều chỉnh</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Lịch học</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">Thứ 3,5,7 | 19:00 - 21:00</p>
              <p className="text-sm text-gray-600">Zoom + tài liệu tự học</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Phản hồi ITS</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">Độ khó đang phù hợp</p>
              <p className="text-sm text-gray-600">Bạn có thể giảm/ tăng nếu thấy không sát.</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">Báo cáo nhanh</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">Gửi email 08:00 mỗi thứ 2</p>
              <p className="text-sm text-gray-600">Bao gồm tiến độ, thời gian học, điểm số.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Danh sách bài học</h3>
                <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Điều chỉnh lộ trình</button>
              </div>
              <div className="mt-4 space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.title}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <span
                      className={`h-8 w-8 rounded-full text-center text-xs font-bold leading-8 text-white ${
                        lesson.status === "done"
                          ? "bg-brand-600"
                          : lesson.status === "in-progress"
                            ? "bg-orange-500"
                            : "bg-gray-300"
                      }`}
                    >
                      {lesson.status === "done"
                        ? "✓"
                        : lesson.status === "in-progress"
                          ? "…"
                          : ""}
                    </span>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{lesson.title}</p>
                        <p className="text-sm text-gray-600">{lesson.duration}</p>
                      </div>
                      <button className="text-sm font-semibold text-brand-600">Xem</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nhiệm vụ & Bài tập</h3>
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Sinh viên</div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {tasks.map((task) => (
                  <div key={task.title} className="rounded-xl border border-gray-200 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">{task.type}</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.due}</p>
                    <div className="mt-3 flex gap-2 text-xs font-semibold">
                      <button className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                        Xem chi tiết
                      </button>
                      <button className="rounded-lg bg-brand-600 px-2 py-1 text-white">Điều chỉnh</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
              <ul className="mt-3 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  Sinh viên hoàn thành 3/4 video tuần 2.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  ITS đề xuất thêm 1 quiz ôn tập khó.
                </li>
                {/* <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                  2 sinh viên cần hỗ trợ: thời gian học thấp.
                </li> */}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-gray-900">Tùy chỉnh</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                  Điều chỉnh độ khó
                </button>
                <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                  Bật cảnh báo email
                </button>
                <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                  Tùy biến lộ trình ITS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
