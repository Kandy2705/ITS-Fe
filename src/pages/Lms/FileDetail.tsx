import { useMemo } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";

const comments = [
  { name: "Sinh viên A", time: "5 phút trước", text: "File rõ ràng, nhưng có thể thêm ví dụ nâng cao?" },
  { name: "Giảng viên", time: "1 giờ trước", text: "Đã thêm phần phụ lục ITS dự đoán câu hỏi thường gặp." },
  { name: "ITS Bot", time: "Hôm qua", text: "Đề xuất luyện tập 15 phút với quiz chương 2." },
];

const FileDetail = () => {
  const { fileId } = useParams();

  const fileName = useMemo(() => fileId || "analysis-report.pdf", [fileId]);

  return (
    <>
      <PageMeta
        title="Chi tiết file"
        description="Xem nội dung, nhận xét và đề xuất ITS cho từng tài liệu"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Tài liệu trong khoá học</p>
                <h2 className="text-xl font-semibold text-gray-900">{fileName}</h2>
                <p className="text-sm text-gray-600">Dung lượng: 1.2MB • Cập nhật bởi giảng viên</p>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Có ITS gợi ý</div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-3 text-sm">
                <p className="text-xs font-semibold uppercase text-gray-500">Loại nội dung</p>
                <p className="font-semibold text-gray-900">PDF - Slide bài giảng</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 text-sm">
                <p className="text-xs font-semibold uppercase text-gray-500">Dành cho</p>
                <p className="font-semibold text-gray-900">Sinh viên & Giảng viên</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 text-sm">
                <p className="text-xs font-semibold uppercase text-gray-500">Trạng thái</p>
                <p className="font-semibold text-gray-900">Đã phát hành</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Tóm tắt nhanh</p>
              <p className="mt-1">
                ITS nhận diện đây là tài liệu quan trọng cho tuần 3. Hệ thống đề xuất sinh viên đọc hết mục 2 & 3 trước
                khi làm bài lab để tiết kiệm 20% thời gian tìm hiểu.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">Gợi ý ITS</span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">Có quiz liên quan</span>
                <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-800">Phù hợp tự học</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-600">
              <p className="text-base font-semibold text-gray-900">Preview nội dung</p>
              <p className="mt-1">(Placeholder) Khu vực này hiển thị nội dung file hoặc video nhúng.</p>
              <div className="mt-4 h-40 rounded-lg bg-gray-100" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Nhận xét & Trao đổi</h3>
              <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Thêm nhận xét</button>
            </div>
            <div className="mt-4 space-y-3">
              {comments.map((comment) => (
                <div key={comment.time} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">{comment.name}</p>
                    <span>{comment.time}</span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.text}</p>
                  <div className="mt-2 flex gap-2 text-xs font-semibold text-brand-600">
                    <button className="rounded-full bg-brand-50 px-3 py-1">Trả lời</button>
                    <button className="rounded-full bg-gray-100 px-3 py-1 text-gray-800">Đánh dấu quan trọng</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">Hành động nhanh</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                Tải xuống file
              </button>
              <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                Gửi qua email
              </button>
              <button className="w-full rounded-lg border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900 transition hover:border-brand-400 hover:bg-brand-50">
                Tạo quiz từ tài liệu
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <h3 className="text-lg font-semibold text-gray-900">Gợi ý bổ sung</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                ITS gợi ý thêm video hướng dẫn 10 phút.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                Gửi thông báo cho sinh viên chưa xem file.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                Xuất báo cáo lượt xem ra PDF/Excel.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileDetail;
