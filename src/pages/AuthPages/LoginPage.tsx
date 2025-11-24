// src/pages/AuthPages/LoginPage.tsx
import AuthPortal from "../Lms/AuthPortal";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <AuthPortal />
      </div>
    </div>
  );
};

export default LoginPage;
