import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { EyeIcon } from '@heroicons/react/24/outline';

type Assignment = {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  submissions: Array<{ student: string; score: number | null; submittedAt: string }>
}

const sampleAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'Bài tập 1 - Giới thiệu và cài đặt',
    course: 'Thiết kế cấu trúc dữ liệu',
    dueDate: '2025-11-10',
    submissions: [
      { student: 'Nguyễn Văn A', score: 9.0, submittedAt: '2025-11-09 20:15' },
      { student: 'Trần Thị B', score: 7.5, submittedAt: '2025-11-10 08:42' },
      { student: 'Lê Văn C', score: null, submittedAt: '2025-11-10 23:01' },
    ]
  },
  {
    id: 'a2',
    title: 'Bài tập 2 - Thuật toán sắp xếp',
    course: 'Thuật toán',
    dueDate: '2025-11-20',
    submissions: [
      { student: 'Phạm D', score: 8.0, submittedAt: '2025-11-19 12:10' },
    ]
  }
];

const TeacherAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAssignment, setOpenAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setAssignments(sampleAssignments);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý bài tập</h1>
          <p className="text-gray-600">Danh sách bài tập của các khóa học và kết quả nộp bài</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-full text-sm">
            <TableHeader className="border-b border-gray-100">
              <TableRow className="bg-gray-50/60">
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">#</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Bài tập</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Khóa học</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Hạn nộp</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Số nộp</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start">Hành động</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {loading ? (
                <TableRow>
                  <td colSpan={6} className="px-4 py-6 text-center">Đang tải...</td>
                </TableRow>
              ) : assignments.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted">Chưa có bài tập</td>
                </TableRow>
              ) : (
                assignments.map((a, i) => (
                  <TableRow key={a.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="px-5 py-4 sm:px-6 text-start">{i + 1}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start font-medium">{a.title}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start">{a.course}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start">{a.dueDate}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start">{a.submissions.length}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setOpenAssignment(a)} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
                          <EyeIcon className="h-4 w-4" />
                          <span>Xem kết quả</span>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal: submission list */}
      {openAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Kết quả: {openAssignment.title}</h2>
                <p className="text-sm text-gray-500">Khóa: {openAssignment.course}</p>
              </div>
              <div>
                <button onClick={() => setOpenAssignment(null)} className="text-gray-500 hover:text-gray-700">Đóng</button>
              </div>
            </div>

            <div className="mt-4">
              <div className="overflow-auto max-h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Sinh viên</th>
                      <th className="px-3 py-2">Điểm</th>
                      <th className="px-3 py-2">Thời gian nộp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openAssignment.submissions.map((s, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">{s.student}</td>
                        <td className="px-3 py-2">{s.score === null ? 'Chưa chấm' : s.score}</td>
                        <td className="px-3 py-2">{s.submittedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setOpenAssignment(null)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherAssignments;
