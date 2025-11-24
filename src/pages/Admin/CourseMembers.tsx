import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageMeta from "../../components/common/PageMeta";

// Types
type MemberRole = 'instructor' | 'student';

interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  joinDate: string;
  lastActive: string;
  avatar?: string;
  progress?: number;
}

// Mock data for instructors
const mockInstructors: Member[] = [
  {
    id: 'i1',
    name: 'Lê Mỹ An',
    email: 'myan@example.com',
    role: 'instructor',
    joinDate: '15/10/2023',
    lastActive: 'Hôm nay',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 'i2',
    name: 'Nguyễn Văn Bình',
    email: 'vanbinh@example.com',
    role: 'instructor',
    joinDate: '20/10/2023',
    lastActive: '2 giờ trước',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
];

// Mock data for students
const mockStudents: Member[] = [
  {
    id: 's1',
    name: 'Trần Thị Cẩm',
    email: 'camtt@example.com',
    role: 'student',
    joinDate: '01/11/2023',
    lastActive: 'Hôm nay',
    progress: 75,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 's2',
    name: 'Phạm Văn Đạt',
    email: 'datpv@example.com',
    role: 'student',
    joinDate: '02/11/2023',
    lastActive: 'Hôm qua',
    progress: 45,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
  {
    id: 's3',
    name: 'Lê Thị Hương',
    email: 'huonglt@example.com',
    role: 'student',
    joinDate: '03/11/2023',
    lastActive: '3 ngày trước',
    progress: 90,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
];

// Mock course data
const mockCourse = {
  id: '1',
  name: 'Lập trình Web nâng cao',
  code: 'WEB202',
  startDate: '01/11/2023',
  endDate: '30/12/2023',
  totalStudents: 25,
  totalInstructors: 2,
};

const CourseMembers = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState<'instructors' | 'students'>('instructors');
  const [searchQuery, setSearchQuery] = useState('');
  
  // In a real app, you would fetch this data based on courseId
  const course = mockCourse;
  const instructors = mockInstructors;
  const students = mockStudents;
  
  // Log courseId to use it and avoid the unused variable warning
  console.log('Current course ID:', courseId);
  
  const filteredMembers = (activeTab === 'instructors' ? instructors : students).filter(
    member => member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm thành viên..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <PageMeta 
        title={`Thành viên - ${course.name}`} 
        description={`Quản lý thành viên khóa học ${course.name}`} 
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <nav className="mb-2 flex space-x-2 text-sm text-gray-500">
              <Link to="/admin/courses" className="hover:text-brand-600">Khóa học</Link>
              <span>/</span>
              <span className="text-gray-400">{course.name}</span>
              <span>/</span>
              <span className="font-medium text-gray-700">Thành viên</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-900">Quản lý thành viên</h1>
            <p className="mt-1 text-gray-600">
              {course.name} • {course.code} • {course.totalStudents} học viên • {course.totalInstructors} giảng viên
            </p>
          </div>
          <div className="flex items-center space-x-3"></div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('instructors')}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'instructors'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Giảng viên
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {instructors.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === 'students'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Học viên
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {students.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Search and actions */}
        <div className="flex flex-col justify-end gap-4 sm:flex-row sm:items-center">
          {/* <div className="relative max-w-xs">
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div> */}
          {/* <div className="flex items-center space-x-3"> */}
            {/* <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Xem dưới dạng
            </button> */}
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Thêm {activeTab === 'instructors' ? 'giảng viên' : 'học viên'}
            </button>
          {/* </div> */}
        </div>

        {/* Members list */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <li key={member.id}>
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div className="flex items-center">
                          <p className="truncate text-sm font-medium text-brand-600">
                            {member.name}
                          </p>
                          {member.role === 'instructor' && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              Giảng viên
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>Tham gia: {member.joinDate}</span>
                          <span className="mx-2">•</span>
                          <span>Hoạt động: {member.lastActive}</span>
                        </div>
                        {member.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-medium text-gray-700">
                                  Tiến độ: {member.progress}%
                                </span>
                              </div>
                            </div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-brand-600"
                                style={{ width: `${member.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                      >
                        <svg
                          className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy thành viên nào</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Không có thành viên nào phù hợp với tìm kiếm của bạn.
                </p>
              </li>
            )}
          </ul>
        </div>


      </div>
    </>
  );
};

export default CourseMembers;
