import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import QuickLinks from "../../components/dashboard/QuickLinks";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | Hệ thống quản lý học tập ITS"
        description="Trang tổng quan của hệ thống quản lý học tập ITS"
      />
      <div className="space-y-6">
        {/* Dashboard Metrics */}
        <DashboardMetrics />

        {/* Quick Links and Recent Activities */}
        <div className="flex">
          <QuickLinks />
        </div>
      </div>
    </>
  );
}
