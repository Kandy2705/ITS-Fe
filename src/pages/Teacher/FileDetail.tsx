import { useMemo } from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const comments = [
  { 
    name: "Nguyễn Văn A", 
    role: "Sinh viên",
    avatar: "A",
    time: "5 phút trước", 
    text: "File rất chi tiết, nhưng em thắc mắc phần 2.3 có thể giải thích rõ hơn không ạ?",
    isTeacher: false
  },
  { 
    name: "Bạn", 
    role: "Giảng viên",
    avatar: "GV",
    time: "1 giờ trước", 
    text: "Đã cập nhật thêm ví dụ minh họa cho phần 2.3. Các em xem thử nhé!",
    isTeacher: true
  },
  { 
    name: "ITS Bot", 
    role: "Hỗ trợ AI",
    avatar: "AI",
    time: "Hôm qua", 
    text: "Đề xuất: Nên thêm 1-2 câu hỏi trắc nghiệm cuối mỗi phần để kiểm tra mức độ hiểu bài của sinh viên.",
    isTeacher: false
  },
];

const TeacherFileDetail = () => {
  const { courseId, fileId } = useParams();
  // const navigate = useNavigate();

  const fileName = useMemo(() => {
    if (!fileId) return "bai-giang-chuong-1.pdf";
    return `${fileId.replace(/-/g, ' ')}.pdf`;
  }, [fileId]);

  const courseName = useMemo(() => {
    if (!courseId) return "Khóa học của tôi";
    return courseId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, [courseId]);

  const fileStats = {
    views: 42,
    downloads: 38,
    lastUpdated: "2 ngày trước",
    studentsViewed: 28,
    studentsTotal: 45,
  };

  return (
    <>
      <PageMeta
        title={`${fileName} - Chi tiết tài liệu`}
        description="Xem và quản lý tài liệu giảng dạy"
      />
      
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Link to="/teacher/courses" className="hover:text-brand-600">Khóa học của tôi</Link>
        <span className="mx-2">/</span>
        <Link to={`/teacher/courses/${courseId}`} className="hover:text-brand-600">{courseName}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{fileName}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{fileName}</h2>
                <p className="text-sm text-gray-600">Trong khóa: {courseName}</p>
                <p className="mt-1 text-xs text-gray-500">Cập nhật lần cuối: {fileStats.lastUpdated}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {}}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-orange-400 hover:bg-orange-50"
                >
                  Chỉnh sửa
                </button>
                <button 
                  onClick={() => {}}
                  className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  Tải xuống
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">{fileStats.views}</p>
                <p className="text-xs text-gray-500">Sinh viên: {fileStats.studentsViewed}/{fileStats.studentsTotal}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Lượt tải</p>
                <p className="text-2xl font-bold text-gray-900">{fileStats.downloads}</p>
                <p className="text-xs text-gray-500">Lần cập nhật: {fileStats.lastUpdated}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Tương tác</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-xs text-gray-500">Tỷ lệ sinh viên xem tài liệu</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Điểm số TB</p>
                <p className="text-2xl font-bold text-gray-900">8.2</p>
                <p className="text-xs text-gray-500">/10 từ đánh giá sinh viên</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-orange-50 p-4 text-sm text-orange-800">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                  <span>!</span>
                </div>
                <div>
                  <p className="font-semibold">Gợi ý từ ITS</p>
                  <p className="mt-1">
                    Tài liệu này có độ khó trung bình. 65% sinh viên xem tài liệu này đạt điểm trên trung bình.
                    <span className="ml-1 font-semibold">Xem báo cáo chi tiết</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Xem trước tài liệu</h3>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Toàn màn hình
                  </button>
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Chia sẻ
                  </button>
                </div>
              </div>
              <div className="mt-3 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Xem trước tài liệu PDF</p>
                  <p className="mt-1 text-xs text-gray-500">Tính năng xem trước sẽ được hiển thị tại đây</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Diễn đàn</h3>
              <button 
                onClick={() => {}}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Thêm nhận xét
              </button>
            </div>
            
            <div className="mt-4 space-y-4">
              {comments.map((comment, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl border p-4 ${comment.isTeacher ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{comment.name}</p>
                          <p className="text-xs text-gray-500">{comment.role} • {comment.time}</p>
                        </div>
                        {comment.isTeacher && (
                          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                            Giảng viên
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{comment.text}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <button className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-gray-100">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span>12</span>
                        </button>
                        <button className="rounded-full px-2 py-1 hover:bg-gray-100">
                          Trả lời
                        </button>
                        <button className="ml-auto rounded-full px-2 py-1 hover:bg-gray-100">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin tệp</h3>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium text-gray-900">Loại tệp</p>
                <p className="text-gray-600">Tài liệu PDF</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Kích thước</p>
                <p className="text-gray-600">2.4 MB</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ngày tải lên</p>
                <p className="text-gray-600">15/11/2023</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Được tải lên bởi</p>
                <p className="text-gray-600">Bạn</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Được xem bởi</p>
                <p className="text-gray-600">28/45 sinh viên</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:border-orange-400 hover:bg-orange-50">
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tải xuống
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">Hành động nhanh</h3>
            <div className="mt-3 space-y-2 text-sm">
              {/* <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-orange-400 hover:bg-orange-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Tạo bản sao tài liệu
              </button> */}
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-orange-400 hover:bg-orange-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Chỉnh sửa thông tin
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-orange-400 hover:bg-orange-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Xem thống kê chi tiết
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-orange-400 hover:bg-orange-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Tạo bài tập từ tài liệu
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-orange-400 hover:bg-orange-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Quản lý quyền truy cập
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">Gợi ý từ ITS</h3>
            <ul className="mt-3 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                <div>
                  <p className="font-medium">Tối ưu hóa tài liệu</p>
                  <p className="text-gray-600">Thêm mục lục để dễ dàng điều hướng hơn</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                <div>
                  <p className="font-medium">Tương tác sinh viên</p>
                  <p className="text-gray-600">5 sinh viên chưa xem tài liệu này</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                <div>
                  <p className="font-medium">Đánh giá</p>
                  <p className="text-gray-600">Sinh viên đánh giá 4.5/5 cho tài liệu này</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherFileDetail;
