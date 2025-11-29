import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

type MaterialFormat = "pdf" | "video" | "slide" | "link";

const materialLabels: Record<MaterialFormat, string> = {
  pdf: "PDF",
  video: "Video",
  slide: "Slide",
  link: "Đường dẫn",
};

const TeacherUploadMaterial = () => {
  const navigate = useNavigate();
  const [material, setMaterial] = useState({
    title: "",
    format: "pdf" as MaterialFormat,
    description: "",
    file: null as File | null,
    link: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMaterial(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!material.title.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Material uploaded:', material);
      setIsSubmitting(false);
      navigate('/teacher/content');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageMeta
        title="Đăng tải học liệu mới"
        description="Tải lên tài liệu, video hoặc liên kết học tập mới"
      />

      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-brand-600 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Đăng tải học liệu mới</h1>
        <p className="text-gray-600">Chia sẻ tài liệu, video hoặc liên kết học tập với sinh viên</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tiêu đề học liệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={material.title}
              onChange={(e) => setMaterial(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ví dụ: Bài giảng tuần 1 - Giới thiệu ReactJS"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Định dạng <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(materialLabels) as MaterialFormat[]).map((format) => (
                <label
                  key={format}
                  className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition ${
                    material.format === format
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={material.format === format}
                    onChange={() => setMaterial(prev => ({ ...prev, format }))}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{materialLabels[format]}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              rows={4}
              value={material.description}
              onChange={(e) => setMaterial(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Mô tả ngắn gọn về học liệu này..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {material.format === 'link' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Đường dẫn <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={material.link}
                onChange={(e) => setMaterial(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com/learning-material"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                required={material.format === 'link'}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tệp đính kèm <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500"
                    >
                      <span>Tải lên file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept={
                          material.format === 'pdf' ? '.pdf' : 
                          material.format === 'video' ? 'video/*' : 
                          material.format === 'slide' ? '.ppt,.pptx,.odp' : 
                          ''
                        }
                        // required={material.format !== 'link'}
                      />
                    </label>
                    <p className="pl-1">hoặc kéo thả vào đây</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {material.format === 'pdf' 
                      ? 'PDF tối đa 10MB' 
                      : material.format === 'video' 
                        ? 'MP4, MOV tối đa 100MB' 
                        : 'PPT, PPTX, ODP tối đa 20MB'}
                  </p>
                </div>
              </div>
              {material.file && (
                <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{material.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(material.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaterial(prev => ({ ...prev, file: null }))}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Xoá</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/teacher/content')}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Huỷ bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !material.title.trim()}
              className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang tải lên...' : 'Đăng tải'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherUploadMaterial;
