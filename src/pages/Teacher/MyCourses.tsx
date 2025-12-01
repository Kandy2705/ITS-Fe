import { useState, useMemo } from "react";
import { Link } from "react-router";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

type SortOption =
  | "progress-asc"
  | "progress-desc"
  | "code-asc"
  | "code-desc"
  | "title-asc"
  | "title-desc";

const teacherCourses = [
  {
    id: "ds-teach",
    courseCode: "CS101",
    title: "Thiết kế bài tập cấu trúc dữ liệu",
    progress: 85,
    credits: 3,
    students: 45,
  },
  {
    id: "ml-path",
    courseCode: "ML201",
    title: "Lộ trình Máy học 8 tuần",
    progress: 23,
    credits: 4,
    students: 32,
  },
  {
    id: "web-advanced",
    courseCode: "WEB301",
    title: "Phát triển Web nâng cao",
    progress: 60,
    credits: 3,
    students: 28,
  },
];

const TeacherCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...teacherCourses];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.courseCode.toLowerCase().includes(query)
      );
    }

    // Sort courses
    result.sort((a, b) => {
      switch (sortBy) {
        case "progress-asc":
          return a.progress - b.progress;
        case "progress-desc":
          return b.progress - a.progress;
        case "code-asc":
          return a.courseCode.localeCompare(b.courseCode);
        case "code-desc":
          return b.courseCode.localeCompare(a.courseCode);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, sortBy]);

  const getSortLabel = (): string => {
    const sortLabels: Record<SortOption, string> = {
      "progress-asc": "Tiến độ (tăng dần)",
      "progress-desc": "Tiến độ (giảm dần)",
      "code-asc": "Mã môn (A-Z)",
      "code-desc": "Mã môn (Z-A)",
      "title-asc": "Tên môn (A-Z)",
      "title-desc": "Tên môn (Z-A)",
    };
    return sortLabels[sortBy];
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            type="button"
            className="inline-flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => setIsSortOpen(!isSortOpen)}
          >
            <span>{getSortLabel()}</span>
            {isSortOpen ? (
              <FiChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <FiChevronDown className="ml-2 h-4 w-4" />
            )}
          </button>
          {isSortOpen && (
            <div className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {[
                  { value: "title-asc", label: "Tên môn (A-Z)" },
                  { value: "title-desc", label: "Tên môn (Z-A)" },
                  { value: "code-asc", label: "Mã môn (A-Z)" },
                  { value: "code-desc", label: "Mã môn (Z-A)" },
                  { value: "progress-desc", label: "Tiến độ (cao nhất)" },
                  { value: "progress-asc", label: "Tiến độ (thấp nhất)" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value as SortOption);
                      setIsSortOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      sortBy === option.value
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredAndSortedCourses.length === 0 ? (
          <div className="col-span-2 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy khóa học
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi từ khoá tìm kiếm
            </p>
          </div>
        ) : (
          filteredAndSortedCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                      {course.courseCode}
                    </span>
                    <Link
                      to={`/teacher/courses/${course.id}`}
                      className="hover:text-brand-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.title}
                      </h3>
                    </Link>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <span>{course.students} học viên</span>
                    <span className="text-gray-400">•</span>
                    <span>{course.credits} tín chỉ</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-500">
                    Đang hoạt động
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>Tiến độ xem bài</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-1">
                <Link
                  to={`/teacher/courses/${course.id}`}
                  className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 font-semibold bg-brand-600 text-white transition hover:bg-brand-700"
                >
                  Quản lý khóa học
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
