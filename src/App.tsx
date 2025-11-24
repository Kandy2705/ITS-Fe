import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
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
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import AuthPortal from "./pages/Lms/AuthPortal";
import MyCourses from "./pages/Lms/MyCourses";
import CourseDetail from "./pages/Lms/CourseDetail";
import FileDetail from "./pages/Lms/FileDetail";
import AdminUsers from "./pages/Lms/AdminUsers";
import AdminCourses from "./pages/Lms/AdminCourses";
import NewCourse from "./pages/Lms/NewCourse";
import ProgramBuilder from "./pages/Lms/ProgramBuilder";
import ExerciseCreator from "./pages/Lms/ExerciseCreator";
import QuizBuilder from "./pages/Lms/QuizBuilder";

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
            <Route path="/calendar" element={<Calendar />} />
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

            {/* LMS Pages */}
            <Route path="/lms/auth" element={<AuthPortal />} />
            <Route path="/lms/courses" element={<MyCourses />} />
            <Route path="/lms/courses/new" element={<NewCourse />} />
            <Route path="/lms/courses/:id" element={<CourseDetail />} />
            <Route path="/lms/courses/:id/files/:fileId" element={<FileDetail />} />
            <Route path="/lms/programs/new" element={<ProgramBuilder />} />
            <Route path="/lms/exercises/new" element={<ExerciseCreator />} />
            <Route path="/lms/quizzes/new" element={<QuizBuilder />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
