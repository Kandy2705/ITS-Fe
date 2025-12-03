import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiFilter,
  FiEdit2,
  FiEye,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";

type DocItem = {
  id: string;
  title: string;
  course: string;
  uploadedAt: string;
  author: string;
  type: string;
  status: "active" | "inactive" | "hidden";
  viewCount: number;
};

const TeacherDocument: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const documents: DocItem[] = [
    {
      id: "1",
      title: "Bài giảng Giải tích - Chương 1",
      course: "Giải tích",
      uploadedAt: "2025-11-01",
      author: "Nguyễn Văn A",
      type: "document",
      status: "active",
      viewCount: 45,
    },
    {
      id: "2",
      title: "Slide Đại số tuyến tính - Buổi 2",
      course: "Đại số tuyến tính",
      uploadedAt: "2025-10-15",
      author: "Trần Thị B",
      type: "slide",
      status: "active",
      viewCount: 32,
    },
    {
      id: "3",
      title: "Bài tập về nhà chương 2",
      course: "Giải tích",
      uploadedAt: "2025-11-10",
      author: "Nguyễn Văn A",
      type: "assignment",
      status: "active",
      viewCount: 28,
    },
  ];

  const filteredAndSortedDocuments = useMemo(() => {
    let result = [...documents];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.course.toLowerCase().includes(query) ||
          doc.author.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      }
      return (
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      );
    });

    return result;
  }, [searchQuery, sortBy]);

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      active: "Đang hiển thị",
      inactive: "Đã ẩn",
      hidden: "Đang ẩn",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string): string => {
    const statusClasses: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      hidden: "bg-gray-100 text-gray-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  const handleDeleteDoc = (id: string) => {
    // In a real app, you would make an API call here to delete the document
    console.log(`Deleting document with id: ${id}`);
    setDocToDelete(null);
    // Optionally, you can remove the document from the local state
    // const updatedDocs = documents.filter(doc => doc.id !== id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900">
                Kho tài liệu
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Quản lý tất cả tài liệu giảng dạy của bạn
              </p>
            </div>
            <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={() => navigate("/teacher/courses")}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Tải tài liệu lên
              </button>
            </div>
          </div>
        </div>

        {/* Search + sort */}
        <div className="px-6 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <FiFilter className="mr-2 h-4 w-4 text-gray-500" />
              Sắp xếp
              {isSortOpen ? (
                <FiChevronUp className="ml-2 h-4 w-4 text-gray-500" />
              ) : (
                <FiChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              )}
            </button>

            {isSortOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === "newest"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Mới nhất
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("oldest");
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      sortBy === "oldest"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Cũ nhất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents list */}
        <div className="border-t border-gray-200">
          {filteredAndSortedDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lượt xem
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString("vi-VN")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {doc.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                            doc.status
                          )}`}
                        >
                          {getStatusLabel(doc.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.viewCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/teacher/courses/${doc.course}/materials/${doc.id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="inline mr-1" size={16} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/teacher/courses/${doc.course}/materials/${doc.id}/edit`
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit2 className="inline mr-1" size={16} />
                        </button>
                        <button
                          onClick={() => setDocToDelete(doc.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="inline" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không tìm thấy tài liệu
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Không có tài liệu nào phù hợp với tiêu chí tìm kiếm của bạn.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {docToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-999999">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDeleteDoc(docToDelete)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDocument;
