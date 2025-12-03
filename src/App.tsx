import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminUserDetail from "./pages/Admin/AdminUserDetail";
import AdminUserEdit from "./pages/Admin/AdminUserEdit";
import AdminUserCreate from "./pages/Admin/AdminUserCreate";
import AdminCoursesList from "./pages/Admin/AdminCoursesList";
import AdminCourseDetail from "./pages/Admin/AdminCourseDetail";
import AdminCourseEdit from "./pages/Admin/AdminCourseEdit";
import AdminAssignTeacher from "./pages/Admin/AdminAssignTeacher";
import CourseMembers from "./pages/Admin/CourseMembers";
import AdminCourseInstances from "./pages/Admin/AdminCourseInstances";
import AdminEnrollStudents from "./pages/Admin/AdminEnrollStudents";
import NewCourse from "./pages/Admin/NewCourse";
import TeacherCourses from "./pages/Teacher/MyCourses";
import TeacherCourseDetail from "./pages/Teacher/CourseDetail";
import TeacherUploadMaterial from "./pages/Teacher/TeacherUploadMaterial";
import TeacherEditMaterial from "./pages/Teacher/TeacherEditMaterial";
import StudentCourses from "./pages/Student/MyCourses";
import StudentCourseDetail from "./pages/Student/CourseDetail";
import StudentFileDetail from "./pages/Student/FileDetail";
import AdminLearningContent from "./pages/Admin/AdminLearningContent";
import FileDetail from "./pages/Teacher/FileDetail";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            {/* <Route path="/calendar" element={<Calendar />} /> */}
            <Route path="/blank" element={<Blank />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/new" element={<AdminUserCreate />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/users/:id/edit" element={<AdminUserEdit />} />
            <Route path="/admin/courses" element={<AdminCoursesList />} />
            <Route path="/admin/courses/:id" element={<AdminCourseDetail />} />
            <Route
              path="/admin/courses/:id/edit"
              element={<AdminCourseEdit />}
            />
            <Route path="/admin/courses/new" element={<NewCourse />} />
            <Route
              path="/admin/courses/instances"
              element={<AdminCourseInstances />}
            />
            <Route
              path="/admin/courses/:courseId/instances"
              element={<AdminCourseInstances />}
            />
            <Route
              path="/admin/course-instances/enroll"
              element={<AdminEnrollStudents />}
            />
            <Route
              path="/admin/course-instances/:id"
              element={<CourseMembers />}
            />
            <Route
              path="/admin/assign-teacher"
              element={<AdminAssignTeacher />}
            />
            <Route path="/admin/content" element={<AdminLearningContent />} />
            {/* Teacher Routes */}
            <Route path="/teacher/courses" element={<TeacherCourses />} />{" "}
            <Route
              path="/teacher/courses/:id"
              element={<TeacherCourseDetail />}
            />
            <Route
              path="/teacher/courses/:courseInstanceId/upload"
              element={<TeacherUploadMaterial />}
            />
            <Route
              path="/teacher/content/upload"
              element={<TeacherUploadMaterial />}
            />
            <Route
              path="/teacher/courses/:courseId/materials/:materialId"
              element={<FileDetail />}
            />
            <Route
              path="/teacher/courses/:courseId/materials/:materialId/edit"
              element={<TeacherEditMaterial />}
            />
            {/* Student Routes */}
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route
              path="/student/courses/:id"
              element={<StudentCourseDetail />}
            />
            <Route
              path="/student/courses/:courseId/files/:fileId"
              element={<StudentFileDetail />}
            />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
