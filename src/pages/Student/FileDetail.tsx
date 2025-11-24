import { useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const comments = [
  { 
    name: "Bạn", 
    role: "Sinh viên",
    avatar: "B",
    time: "5 phút trước", 
    text: "Tài liệu rất hữu ích, nhưng phần 2.3 hơi khó hiểu.",
    isMe: true
  },
  { 
    name: "Nguyễn Văn A", 
    role: "Sinh viên",
    avatar: "A",
    time: "2 giờ trước", 
    text: "Ai giải thích giúp mình phần 3.2 với ạ?",
    isMe: false
  },
  { 
    name: "Trần Thị B", 
    role: "Sinh viên",
    avatar: "T",
    time: "3 giờ trước", 
    text: "Tôi cũng đang thắc mắc phần đó. @Nguyễn Văn A chúng ta có thể thảo luận thêm không?",
    isMe: false
  },
  { 
    name: "ITS Bot", 
    role: "Hỗ trợ AI",
    avatar: "AI",
    time: "Hôm qua", 
    text: "Dựa trên tiến độ của bạn, tôi đề xuất xem kỹ phần 2.3 và làm bài tập liên quan để hiểu sâu hơn.",
    isMe: false
  },
];

const StudentFileDetail = () => {
  const { courseId, fileId } = useParams();
  // const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fileName = useMemo(() => {
    if (!fileId) return "bai-giang-chuong-1.pdf";
    return `${fileId.replace(/-/g, ' ')}.pdf`;
  }, [fileId]);

  const courseName = useMemo(() => {
    if (!courseId) return "Khóa học của tôi";
    return courseId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, [courseId]);

  const fileStats = {
    views: 24,
    downloads: 18,
    lastUpdated: "2 ngày trước",
    totalStudents: 45,
    avgTimeSpent: "15 phút",
    understandingLevel: "80%"
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, you would add the comment to the state or send it to an API
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <>
      <PageMeta
        title={`${fileName} - Tài liệu học tập`}
        description="Xem và tương tác với tài liệu học tập"
      />
      
      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Link to="/student/courses" className="hover:text-brand-600">Khóa học của tôi</Link>
        <span className="mx-2">/</span>
        <Link to={`/student/courses/${courseId}`} className="hover:text-brand-600">{courseName}</Link>
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
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {isBookmarked ? (
                    <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                  <span>{isBookmarked ? 'Đã lưu' : 'Lưu lại'}</span>
                </button>
                <button 
                  onClick={() => {}}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Tải xuống
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Thời gian học</p>
                <p className="text-2xl font-bold text-gray-900">{fileStats.avgTimeSpent}</p>
                <p className="text-xs text-gray-500">Trung bình: 12 phút</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Độ hiểu bài</p>
                <p className="text-2xl font-bold text-gray-900">{fileStats.understandingLevel}</p>
                <p className="text-xs text-gray-500">Dựa trên bài kiểm tra</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">{fileStats.views}</p>
                <p className="text-xs text-gray-500">Lần xem của bạn</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                  <span>!</span>
                </div>
                <div>
                  <p className="font-semibold">Gợi ý học tập từ ITS</p>
                  <p className="mt-1">
                    Tài liệu này phù hợp với mục tiêu học tập của bạn. Hãy dành ít nhất 15 phút để xem kỹ phần 2.3 vì đây là nội dung quan trọng.
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
            </div>
            
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                  B
                </div>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder="Đặt câu hỏi hoặc bình luận về tài liệu này..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button type="button" className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <button type="button" className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      type="submit"
                      className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
                      disabled={!newComment.trim()}
                    >
                      Đăng
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-6 space-y-4">
              {comments.map((comment, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl border p-4 ${comment.isMe ? 'border-brand-200 bg-brand-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-semibold ${
                      comment.isMe ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{comment.name}</p>
                          <p className="text-xs text-gray-500">{comment.role} • {comment.time}</p>
                        </div>
                        {comment.isMe && (
                          <span className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800">
                            Bạn
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{comment.text}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <button 
                          className="flex items-center gap-1 rounded-full px-2 py-1 hover:bg-gray-100"
                          onClick={() => setIsLiked(!isLiked)}
                        >
                          <svg 
                            className={`h-4 w-4 ${isLiked ? 'text-brand-600 fill-current' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d={isLiked ? "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" : "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"} 
                            />
                          </svg>
                          <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
                        </button>
                        <button className="rounded-full px-2 py-1 hover:bg-gray-100">
                          Trả lời
                        </button>
                        {!comment.isMe && (
                          <button className="ml-auto rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </button>
                        )}
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
                <p className="font-medium text-gray-900">Được xem bởi</p>
                <p className="text-gray-600">{fileStats.views}/{fileStats.totalStudents} sinh viên</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition hover:border-brand-400 hover:bg-brand-50">
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tải xuống tài liệu
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">Hành động nhanh</h3>
            <div className="mt-3 space-y-2 text-sm">
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Lưu vào tài liệu đã lưu
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Chia sẻ với bạn bè
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Xem lần đọc trước
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                In tài liệu
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">Gợi ý từ ITS</h3>
            <ul className="mt-3 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Mục tiêu học tập</p>
                  <p className="text-gray-600">Hiểu rõ các khái niệm cơ bản về cấu trúc dữ liệu</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Thời gian khuyến nghị</p>
                  <p className="text-gray-600">Dành ít nhất 30 phút để nghiên cứu tài liệu này</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Bài tập liên quan</p>
                  <p className="text-gray-600">Làm bài tập chương 2 sau khi đọc xong</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Tài liệu bổ sung</p>
                  <p className="text-gray-600">Xem video bài giảng chương 2 để hiểu sâu hơn</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentFileDetail;
