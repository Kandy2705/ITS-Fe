import { useState } from 'react';
import { useNavigate } from 'react-router';
import PageMeta from '../../components/common/PageMeta';

type ToggleKey = 'published' | 'private' | 'upcoming' | 'draft' | 'paid' | 'completionCert' | 'paidCert';

const colorPresets = [
  { name: 'Ocean', value: '#1E90FF' },
  { name: 'Sunset', value: '#F59E0B' },
  { name: 'Forest', value: '#16A34A' },
  { name: 'Rose', value: '#EC4899' },
  { name: 'Slate', value: '#0F172A' },
];

const TeacherNewCourse = () => {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    published: false,
    private: false,
    upcoming: false,
    draft: true,
    paid: false,
    completionCert: true,
    paidCert: false,
  });

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    instructor: '',
    tags: '',
    shortDescription: '',
    fullDescription: '',
    videoUrl: '',
    relatedContent: '',
    primaryColor: '#1E90FF',
  });

  // const handleToggle = (key: ToggleKey) => {
  //   setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log({ ...formData, ...toggles });
    // Navigate back to courses list after submission
    navigate('/teacher/courses');
  };

  return (
    <>
      <PageMeta title="Tạo khoá học mới" description="Biểu mẫu thêm khoá học với đầy đủ thông tin và tuỳ chọn" />
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-6 shadow-card md:flex-row md:items-center">
          <div>
            <p className="text-sm text-gray-500">Quản lý / Khóa học / Tạo mới</p>
            <h1 className="text-2xl font-semibold text-gray-900">Tạo mới khoá học</h1>
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => navigate("/teacher/courses")}
              className="h-10 rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              type="submit"
              form="course-form"
              className="h-10 rounded-lg bg-orange-600 px-6 text-sm font-semibold text-white shadow hover:bg-orange-700"
            >
              Lưu khoá học
            </button>
          </div>
        </div>

        <form id="course-form" onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Chi tiết</h2>
                <span className="text-xs font-semibold text-orange-600">Bắt buộc</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Tiêu đề *
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Lập trình Web nâng cao"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Danh mục
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Web, AI, Data..."
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Giảng viên *
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Tên người phụ trách"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Tags
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Thêm từ khoá, nhấn enter"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2 text-sm font-semibold text-gray-800">
                  Ảnh khoá học
                  <div className="flex items-center gap-4">
                    <button 
                      type="button"
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-orange-400 hover:bg-orange-50"
                    >
                      Upload
                    </button>
                    <p className="text-sm font-normal text-gray-600">Ảnh xuất hiện ở thẻ khoá học</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm font-semibold text-gray-800">
                  Màu chủ đạo
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, primaryColor: preset.value }))}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                          formData.primaryColor === preset.value 
                            ? 'border-orange-500 bg-orange-50 text-orange-700' 
                            : 'border-gray-200 text-gray-800 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                      >
                        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: preset.value }} />
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Giới thiệu khoá học</h2>
              <div className="mt-4 grid gap-4">
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Mở đầu ngắn
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Một câu giới thiệu ngắn gọn"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Mô tả chi tiết *
                  <textarea
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    className="min-h-[140px] w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Giới thiệu nội dung, yêu cầu nền tảng, kết quả đạt được..."
                    required
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Video giới thiệu
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Link Youtube ngắn giới thiệu khoá"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-800">
                  Nội dung liên quan
                  <input
                    type="text"
                    name="relatedContent"
                    value={formData.relatedContent}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-orange-500 focus:outline-none"
                    placeholder="Ví dụ: React Hooks, Express API, DevOps..."
                  />
                </label>
              </div>
            </section>

            {/* <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Giá & chứng chỉ</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {['paid', 'completionCert', 'paidCert'].map((key) => {
                  const labelMap: Record<string, string> = {
                    paid: 'Khoá học trả phí',
                    completionCert: 'Chứng chỉ hoàn thành',
                    paidCert: 'Chứng chỉ có phí',
                  };
                  return (
                    <label key={key} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        checked={toggles[key as ToggleKey]}
                        onChange={() => handleToggle(key as ToggleKey)}
                      />
                      {labelMap[key]}
                    </label>
                  );
                })}
              </div>
            </section> */}
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Cài đặt</h2>
              <div className="mt-4 space-y-3 text-sm font-semibold text-gray-800">
                {[
                  { key: 'published', label: 'Công khai' },
                  { key: 'private', label: 'Riêng tư' },
                  { key: 'upcoming', label: 'Sắp ra mắt' },
                  { key: 'draft', label: 'Bản nháp' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                    <span>{item.label}</span>
                    <input
                      type="radio"
                      name="status"
                      className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
                      checked={toggles[item.key as ToggleKey]}
                      onChange={() => {
                        // Uncheck all other statuses
                        const newToggles = { ...toggles };
                        (Object.keys(newToggles) as ToggleKey[]).forEach(k => {
                          newToggles[k] = k === item.key;
                        });
                        setToggles(newToggles);
                      }}
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-gray-900">Xem trước</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">Thẻ khoá học</p>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                  <div 
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    {formData.title ? formData.title.charAt(0) : 'CO'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formData.title || 'Tên khoá học'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formData.shortDescription || '1 dòng mô tả ngắn'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">ITS sẽ dùng thông tin trên để cá nhân hoá gợi ý cho người học.</p>
              </div>
            </section>
          </aside>
        </form>
      </div>
    </>
  );
};

export default TeacherNewCourse;
