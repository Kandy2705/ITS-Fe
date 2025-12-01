import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

type DocItem = {
  id: string;
  title: string;
  course: string;
  uploadedAt: string;
  author: string;
};

const TeacherDocument: React.FC = () => {
  const [items, setItems] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setItems([
        { id: '1', title: 'Bài giảng Giải tích - Chương 1', course: 'Giải tích', uploadedAt: '2025-11-01', author: 'Nguyen Van A' },
        { id: '2', title: 'Slide Đại số tuyến tính - Buổi 2', course: 'Đại số tuyến tính', uploadedAt: '2025-10-15', author: 'Tran Thi B' },
      ]);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Kho tài liệu</h1>
        <button
          onClick={() => navigate('/teacher/content/upload')}
          className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Tải tài liệu lên
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow className="bg-gray-50/50">
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">#</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tiêu đề</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Khóa học</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tác giả</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ngày tải lên</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Hành động</TableCell>
                </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={6} className="px-4 py-6 text-center">Đang tải...</td>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted">Chưa có tài liệu.</td>
                </TableRow>
              ) : (
                items.map((it, idx) => (
                  <TableRow key={it.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="px-5 py-4 sm:px-6 text-start">{idx + 1}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300 font-medium">{it.title}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{it.course}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{it.author}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{it.uploadedAt}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Link to={`/teacher/courses/${encodeURIComponent(it.course)}/files/${it.id}`} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
                          <EyeIcon className="h-4 w-4" />
                          <span>Xem</span>
                        </Link>
                        <Link to={`/teacher/content/edit?docId=${it.id}`} className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-1 text-sm font-medium text-white hover:bg-brand-700">
                          <PencilSquareIcon className="h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDocument;
